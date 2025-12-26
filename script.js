// Мобильное меню
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }

    // Закрытие меню при клике на ссылку
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                nav.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
    });

    // Закрытие меню при изменении размера окна
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            nav.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    });

    // Плавная прокрутка для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Проверка подключения по адресу
    initAddressCheck();
    
    // Инициализация переключателей дополнительных опций
    initTariffAddons();
});

// Функции для проверки адреса
let selectedAddress = null;
let yandexMapCheck = null;
let mapMarkerCheck = null;

// Статические данные для автодополнения (демо)
const addressSuggestions = [
    'Москва, Тверская ул., 1',
    'Москва, Ленинский просп., 10',
    'Москва, Кутузовский просп., 25',
    'Москва, Новокузнецкая ул., 5',
    'Москва, Арбат ул., 15'
];

let selectedAutocompleteIndex = -1;
let autocompleteItems = [];

function initAddressCheck() {
    const addressInput = document.getElementById('addressInput');
    const checkAddressBtn = document.getElementById('checkAddressBtn');
    const autocomplete = document.getElementById('addressAutocomplete');

    if (!addressInput) return;

    // Обработчик ввода текста для автодополнения
    addressInput.addEventListener('input', function() {
        const value = this.value.trim();
        selectedAutocompleteIndex = -1;
        
        if (value.length > 0 && value.toLowerCase().includes('москва')) {
            showAutocomplete(value);
        } else {
            hideAutocomplete();
        }
    });

    // Обработчик фокуса
    addressInput.addEventListener('focus', function() {
        const value = this.value.trim();
        if (value.length > 0 && value.toLowerCase().includes('москва')) {
            showAutocomplete(value);
        }
    });

    // Обработчик потери фокуса (с задержкой для клика по элементу)
    addressInput.addEventListener('blur', function() {
        setTimeout(() => {
            hideAutocomplete();
        }, 200);
    });

    // Обработчик клавиатуры для навигации по автодополнению
    addressInput.addEventListener('keydown', function(e) {
        if (!autocomplete || !autocomplete.classList.contains('active')) return;

        const items = autocomplete.querySelectorAll('.autocomplete-item');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedAutocompleteIndex = Math.min(selectedAutocompleteIndex + 1, items.length - 1);
            updateSelectedItem(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedAutocompleteIndex = Math.max(selectedAutocompleteIndex - 1, -1);
            updateSelectedItem(items);
        } else if (e.key === 'Enter' && selectedAutocompleteIndex >= 0) {
            e.preventDefault();
            const selectedItem = items[selectedAutocompleteIndex];
            if (selectedItem) {
                addressInput.value = selectedItem.dataset.value;
                hideAutocomplete();
                checkAddress(addressInput.value.trim());
            }
        } else if (e.key === 'Escape') {
            hideAutocomplete();
        }
    });

    // Обработчик кнопки "Проверить"
    if (checkAddressBtn) {
        checkAddressBtn.addEventListener('click', function() {
            const address = addressInput.value.trim();
            if (address) {
                checkAddress(address);
                hideAutocomplete();
            } else {
                alert('Пожалуйста, введите адрес');
            }
        });
    }

    // Обработчик Enter в поле ввода
    addressInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && selectedAutocompleteIndex < 0) {
            const address = this.value.trim();
            if (address) {
                checkAddress(address);
                hideAutocomplete();
            }
        }
    });

    // Инициализация карты в блоке
    initAddressCheckMap();
}

// Инициализация карты в блоке проверки адреса
function initAddressCheckMap() {
    const mapContainer = document.getElementById('addressCheckMap');
    if (!mapContainer) return;

    // Функция инициализации карты
    function initMap() {
        if (typeof ymaps === 'undefined') {
            // Если ymaps еще не загружен, ждем и пробуем снова
            setTimeout(initMap, 100);
            return;
        }

        // Ждем полной загрузки API
        ymaps.ready(function() {
            try {
                yandexMapCheck = new ymaps.Map('addressCheckMap', {
                    center: [55.7558, 37.6173], // Москва по умолчанию
                    zoom: 12,
                    controls: ['zoomControl', 'fullscreenControl', 'geolocationControl']
                });

                // Обработчик клика на карту для выбора адреса
                yandexMapCheck.events.add('click', function(e) {
                    const coords = e.get('coords');
                    
                    // Получаем адрес по координатам (обратное геокодирование)
                    ymaps.geocode(coords).then(function(res) {
                        const firstGeoObject = res.geoObjects.get(0);
                        if (firstGeoObject) {
                            const address = firstGeoObject.getAddressLine();
                            
                            // Обновляем поле ввода
                            const addressInput = document.getElementById('addressInput');
                            if (addressInput) {
                                addressInput.value = address;
                            }
                            
                            // Обновляем карту с меткой и проверяем адрес
                            updateAddressCheckMap(address, true);
                            checkAddress(address);
                        }
                    });
                });

                // Добавляем зоны покрытия
                addCoverageZonesCheck();
            } catch (error) {
                console.error('Ошибка инициализации карты:', error);
                // Заглушка при ошибке
                mapContainer.innerHTML = `
                    <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: linear-gradient(135deg, #E6F2FF 0%, #FFFFFF 100%); border-radius: 12px;">
                        <div style="text-align: center; color: #666;">
                            <div style="font-size: 48px; margin-bottom: 16px;">🗺️</div>
                            <div>Ошибка загрузки карты</div>
                            <div style="font-size: 12px; margin-top: 8px; opacity: 0.7;">
                                Проверьте API ключ Yandex Maps
                            </div>
                        </div>
                    </div>
                `;
            }
        });
    }

    // Пробуем инициализировать карту
    initMap();

    // Если через 5 секунд карта не загрузилась, показываем заглушку
    setTimeout(function() {
        if (!yandexMapCheck && mapContainer) {
            mapContainer.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: linear-gradient(135deg, #E6F2FF 0%, #FFFFFF 100%); border-radius: 12px;">
                    <div style="text-align: center; color: #666;">
                        <div style="font-size: 48px; margin-bottom: 16px;">🗺️</div>
                        <div>Карта будет отображена здесь</div>
                        <div style="font-size: 12px; margin-top: 8px; opacity: 0.7;">
                            Для работы карты необходим API ключ Yandex Maps<br>
                            Укажите его в строке 9 файла index.html
                        </div>
                    </div>
                </div>
            `;
        }
    }, 5000);
}

// Обновление карты в блоке проверки адреса
function updateAddressCheckMap(address, isAvailable) {
    if (!yandexMapCheck) return;

    // Удаляем предыдущую метку
    if (mapMarkerCheck) {
        yandexMapCheck.geoObjects.remove(mapMarkerCheck);
    }

    // Получаем координаты адреса
    ymaps.geocode(address).then(function(res) {
        const firstGeoObject = res.geoObjects.get(0);
        if (firstGeoObject) {
            const coords = firstGeoObject.geometry.getCoordinates();
            
            // Создаем метку
            const iconColor = isAvailable ? '#4CAF50' : '#FF9800';
            const iconGlyph = isAvailable ? 'check' : 'warning';
            
            mapMarkerCheck = new ymaps.Placemark(coords, {
                balloonContent: `<strong>${address}</strong><br>${isAvailable ? 'Подключение доступно' : 'Требуется уточнение'}`
            }, {
                iconColor: iconColor,
                iconGlyph: iconGlyph,
                preset: 'islands#circleIcon'
            });

            yandexMapCheck.geoObjects.add(mapMarkerCheck);
            yandexMapCheck.setCenter(coords, 15);
            
            // Открываем балун
            mapMarkerCheck.balloon.open();
        }
    });
}

// Добавление зон покрытия на карту в блоке
function addCoverageZonesCheck() {
    if (!yandexMapCheck) return;

    // Пример зон покрытия (Москва)
    const coverageZones = [
        {
            coords: [[55.7, 37.5], [55.8, 37.5], [55.8, 37.7], [55.7, 37.7]],
            color: 'rgba(76, 175, 80, 0.3)',
            strokeColor: '#4CAF50'
        },
        {
            coords: [[55.6, 37.4], [55.7, 37.4], [55.7, 37.6], [55.6, 37.6]],
            color: 'rgba(76, 175, 80, 0.3)',
            strokeColor: '#4CAF50'
        }
    ];

    coverageZones.forEach(zone => {
        const polygon = new ymaps.Polygon([zone.coords], {}, {
            fillColor: zone.color,
            strokeColor: zone.strokeColor,
            strokeWidth: 2,
            opacity: 0.6
        });

        yandexMapCheck.geoObjects.add(polygon);
    });
}

// Показать автодополнение
function showAutocomplete(query) {
    const autocomplete = document.getElementById('addressAutocomplete');
    if (!autocomplete) return;

    const queryLower = query.toLowerCase();
    const filtered = addressSuggestions.filter(addr => 
        addr.toLowerCase().includes(queryLower)
    );

    if (filtered.length === 0) {
        hideAutocomplete();
        return;
    }

    autocomplete.innerHTML = '';
    autocompleteItems = [];

    filtered.forEach((address, index) => {
        const item = document.createElement('div');
        item.className = 'autocomplete-item';
        item.dataset.value = address;
        item.dataset.index = index;
        
        // Подсветка совпадающего фрагмента
        const highlightedText = highlightMatch(address, query);
        item.innerHTML = `<div class="autocomplete-item-text">${highlightedText}</div>`;
        
        item.addEventListener('click', function() {
            const addressInput = document.getElementById('addressInput');
            if (addressInput) {
                addressInput.value = address;
                hideAutocomplete();
                checkAddress(address);
            }
        });

        autocomplete.appendChild(item);
        autocompleteItems.push(item);
    });

    autocomplete.classList.add('active');
}

// Скрыть автодополнение
function hideAutocomplete() {
    const autocomplete = document.getElementById('addressAutocomplete');
    if (autocomplete) {
        autocomplete.classList.remove('active');
        selectedAutocompleteIndex = -1;
    }
}

// Подсветка совпадающего фрагмента
function highlightMatch(text, query) {
    if (!query || query.trim() === '') return text;
    
    const queryLower = query.toLowerCase();
    const textLower = text.toLowerCase();
    const index = textLower.indexOf(queryLower);
    
    if (index === -1) return text;
    
    const before = text.substring(0, index);
    const match = text.substring(index, index + query.length);
    const after = text.substring(index + query.length);
    
    return `${before}<span class="autocomplete-highlight">${match}</span>${after}`;
}

// Обновить выбранный элемент
function updateSelectedItem(items) {
    items.forEach((item, index) => {
        if (index === selectedAutocompleteIndex) {
            item.classList.add('selected');
            item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        } else {
            item.classList.remove('selected');
        }
    });
}

// Проверка адреса
function checkAddress(address) {
    const checkAddressBtn = document.getElementById('checkAddressBtn');
    
    if (!checkAddressBtn) return;

    // Показываем состояние загрузки
    const originalText = checkAddressBtn.textContent;
    checkAddressBtn.disabled = true;
    checkAddressBtn.textContent = 'Проверка...';

    // Имитация запроса к API
    setTimeout(() => {
        // Случайный результат для демонстрации
        const isAvailable = Math.random() > 0.3; // 70% вероятность доступности
        
        // Восстанавливаем кнопку
        checkAddressBtn.disabled = false;
        checkAddressBtn.textContent = originalText;

        // Показываем модальное окно с результатом
        showAddressResultModal(address, isAvailable);
        
        // Обновляем карту с результатом
        if (yandexMapCheck) {
            updateAddressCheckMap(address, isAvailable);
        }
    }, 1500);
}

// Инициализация переключателей дополнительных опций
const baseTariffPrice = 699;

function initTariffAddons() {
    const addonSwitches = document.querySelectorAll('.addon-switch-input');
    const totalAmountElement = document.getElementById('tariffTotalAmount');
    
    // Функция для обновления итоговой суммы
    function updateTotalPrice() {
        let total = baseTariffPrice;
        
        addonSwitches.forEach(switchEl => {
            if (switchEl.checked) {
                const price = parseInt(switchEl.dataset.price) || 0;
                total += price;
            }
        });
        
        if (totalAmountElement) {
            totalAmountElement.textContent = total;
        }
    }
    
    addonSwitches.forEach(switchEl => {
        switchEl.addEventListener('change', function() {
            const price = parseInt(this.dataset.price) || 0;
            const addonItem = this.closest('.tariff-addon-item');
            const priceElement = addonItem.querySelector('.addon-price');
            
            if (this.checked) {
                priceElement.textContent = `+${price} ₽`;
                addonItem.style.backgroundColor = 'rgba(230, 242, 255, 0.4)';
                addonItem.style.border = '1px solid rgba(0, 102, 204, 0.2)';
            } else {
                priceElement.textContent = `+${price} ₽`;
                addonItem.style.backgroundColor = '#F5F5F5';
                addonItem.style.border = 'none';
            }
            
            // Обновляем итоговую сумму
            updateTotalPrice();
        });
    });
    
    // Инициализируем начальную сумму
    updateTotalPrice();
}