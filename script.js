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
    initMapModal();
    
    // Инициализация FAQ
    initFAQ();
    
    // Инициализация переключателей дополнительных опций
    initTariffAddons();
    
    // Инициализация анимации статистики поддержки
    initSupportStatsAnimation();
});

// Функции для проверки адреса
let selectedAddress = null;
let yandexMapModal = null;
let mapMarkerModal = null;

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
    const openMapLink = document.getElementById('openMapLink');
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

    // Обработчик ссылки "Указать адрес на карте"
    if (openMapLink) {
        openMapLink.addEventListener('click', function(e) {
            e.preventDefault();
            openMapModal();
        });
    }
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
    }, 1500);
}

// Показать модальное окно с результатом проверки
function showAddressResultModal(address, isAvailable) {
    const modal = document.getElementById('addressResultModal');
    const icon = document.getElementById('addressResultIcon');
    const title = document.getElementById('addressResultTitle');
    const addressEl = document.getElementById('addressResultAddress');
    const description = document.getElementById('addressResultDescription');
    const connectBtn = document.getElementById('addressResultConnectBtn');
    
    if (!modal) return;

    // Заполняем данные в зависимости от результата
    if (isAvailable) {
        icon.innerHTML = `
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M8 12L11 15L16 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
        icon.className = 'address-result-icon address-result-icon-success';
        title.textContent = 'Подключение доступно!';
        addressEl.textContent = address;
        description.textContent = 'Отлично! Мы можем подключить интернет по вашему адресу. Оставьте заявку, и мы свяжемся с вами в ближайшее время.';
        connectBtn.style.display = 'block';
    } else {
        icon.innerHTML = `
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M12 8V12M12 16H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
        `;
        icon.className = 'address-result-icon address-result-icon-warning';
        title.textContent = 'Пока не подключены';
        addressEl.textContent = address;
        description.textContent = 'К сожалению, мы пока не подключены к вашему адресу. Оставьте заявку, и мы сообщим вам, когда появится возможность подключения.';
        connectBtn.style.display = 'block';
    }

    // Показываем модальное окно
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Обработчики закрытия
    const closeBtn = document.getElementById('addressResultModalClose');
    const closeBtnSecondary = document.getElementById('addressResultCloseBtn');
    
    if (closeBtn) {
        closeBtn.onclick = () => closeAddressResultModal();
    }
    
    if (closeBtnSecondary) {
        closeBtnSecondary.onclick = () => closeAddressResultModal();
    }

    // Закрытие при клике вне модального окна
    modal.onclick = (e) => {
        if (e.target === modal) {
            closeAddressResultModal();
        }
    };

    // Закрытие по Escape
    const escapeHandler = (e) => {
        if (e.key === 'Escape') {
            closeAddressResultModal();
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);

    // Обработчик кнопки "Оставить заявку"
    if (connectBtn) {
        connectBtn.onclick = () => {
            closeAddressResultModal();
            // Закрываем также модальное окно карты, если оно открыто
            closeMapModal();
            // Прокрутка к форме контактов или открытие формы заявки
            const contactsSection = document.getElementById('contacts');
            if (contactsSection) {
                contactsSection.scrollIntoView({ behavior: 'smooth' });
            }
        };
    }
}

// Закрыть модальное окно результата
function closeAddressResultModal() {
    const modal = document.getElementById('addressResultModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Инициализация модального окна с картой
function initMapModal() {
    const mapModal = document.getElementById('mapModal');
    const mapModalClose = document.getElementById('mapModalClose');
    const checkModalBtn = document.getElementById('checkModalBtn');
    const mapModalInput = document.getElementById('mapModalInput');
    const mapModalAutocomplete = document.getElementById('mapModalAutocomplete');

    if (!mapModal) return;

    // Закрытие модального окна
    if (mapModalClose) {
        mapModalClose.addEventListener('click', function() {
            closeMapModal();
        });
    }

    // Закрытие при клике вне модального окна
    mapModal.addEventListener('click', function(e) {
        if (e.target === mapModal) {
            closeMapModal();
        }
    });

    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mapModal.classList.contains('active')) {
            closeMapModal();
        }
    });

    // Инициализация автодополнения для поля ввода в модальном окне
    let selectedAutocompleteIndexModal = -1;
    let autocompleteItemsModal = [];

    if (mapModalInput && mapModalAutocomplete) {
        // Обработчик ввода текста для автодополнения
        mapModalInput.addEventListener('input', function() {
            const value = this.value.trim();
            selectedAutocompleteIndexModal = -1;
            
            if (value.length > 0 && value.toLowerCase().includes('москва')) {
                showModalAutocomplete(value, mapModalAutocomplete, mapModalInput, autocompleteItemsModal);
            } else {
                hideModalAutocomplete(mapModalAutocomplete);
            }
        });

        // Обработчик фокуса
        mapModalInput.addEventListener('focus', function() {
            const value = this.value.trim();
            if (value.length > 0 && value.toLowerCase().includes('москва')) {
                showModalAutocomplete(value, mapModalAutocomplete, mapModalInput, autocompleteItemsModal);
            }
        });

        // Обработчик потери фокуса
        mapModalInput.addEventListener('blur', function() {
            setTimeout(() => {
                hideModalAutocomplete(mapModalAutocomplete);
            }, 200);
        });

        // Обработчик клавиатуры для навигации по автодополнению
        mapModalInput.addEventListener('keydown', function(e) {
            if (!mapModalAutocomplete || !mapModalAutocomplete.classList.contains('active')) return;

            const items = mapModalAutocomplete.querySelectorAll('.autocomplete-item');
            
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                selectedAutocompleteIndexModal = Math.min(selectedAutocompleteIndexModal + 1, items.length - 1);
                updateSelectedItemModal(items, selectedAutocompleteIndexModal);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                selectedAutocompleteIndexModal = Math.max(selectedAutocompleteIndexModal - 1, -1);
                updateSelectedItemModal(items, selectedAutocompleteIndexModal);
            } else if (e.key === 'Enter' && selectedAutocompleteIndexModal >= 0) {
                e.preventDefault();
                const selectedItem = items[selectedAutocompleteIndexModal];
                if (selectedItem) {
                    mapModalInput.value = selectedItem.dataset.value;
                    hideModalAutocomplete(mapModalAutocomplete);
                    checkAddressFromModal(mapModalInput.value.trim());
                }
            } else if (e.key === 'Escape') {
                hideModalAutocomplete(mapModalAutocomplete);
            }
        });
    }

    // Обработчик кнопки "ПРОВЕРИТЬ" в модальном окне
    if (checkModalBtn) {
        checkModalBtn.addEventListener('click', function() {
            const address = mapModalInput ? mapModalInput.value.trim() : '';
            if (address) {
                checkAddressFromModal(address);
                if (mapModalAutocomplete) {
                    hideModalAutocomplete(mapModalAutocomplete);
                }
            } else {
                alert('Пожалуйста, введите адрес');
            }
        });
    }

    // Enter в поле ввода модального окна
    if (mapModalInput) {
        mapModalInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && selectedAutocompleteIndexModal < 0) {
                const address = this.value.trim();
                if (address) {
                    checkAddressFromModal(address);
                    if (mapModalAutocomplete) {
                        hideModalAutocomplete(mapModalAutocomplete);
                    }
                }
            }
        });
    }
}

// Показать автодополнение в модальном окне
function showModalAutocomplete(query, autocomplete, input, itemsArray) {
    if (!autocomplete) return;

    const queryLower = query.toLowerCase();
    const filtered = addressSuggestions.filter(addr => 
        addr.toLowerCase().includes(queryLower)
    );

    if (filtered.length === 0) {
        hideModalAutocomplete(autocomplete);
        return;
    }

    autocomplete.innerHTML = '';
    itemsArray.length = 0;

    filtered.forEach((address, index) => {
        const item = document.createElement('div');
        item.className = 'autocomplete-item';
        item.dataset.value = address;
        item.dataset.index = index;
        
        // Подсветка совпадающего фрагмента
        const highlightedText = highlightMatch(address, query);
        item.innerHTML = `<div class="autocomplete-item-text">${highlightedText}</div>`;
        
        item.addEventListener('click', function() {
            if (input) {
                input.value = address;
                hideModalAutocomplete(autocomplete);
                checkAddressFromModal(address);
            }
        });

        autocomplete.appendChild(item);
        itemsArray.push(item);
    });

    autocomplete.classList.add('active');
}

// Скрыть автодополнение в модальном окне
function hideModalAutocomplete(autocomplete) {
    if (autocomplete) {
        autocomplete.classList.remove('active');
    }
}

// Обновить выбранный элемент в модальном окне
function updateSelectedItemModal(items, selectedIndex) {
    items.forEach((item, index) => {
        if (index === selectedIndex) {
            item.classList.add('selected');
            item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        } else {
            item.classList.remove('selected');
        }
    });
}

// Открытие модального окна
function openMapModal() {
    const mapModal = document.getElementById('mapModal');
    const mapModalInput = document.getElementById('mapModalInput');
    const addressInput = document.getElementById('addressInput');

    if (!mapModal) return;

    // Копируем значение из основного поля ввода
    if (mapModalInput && addressInput) {
        mapModalInput.value = addressInput.value;
    }

    mapModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Инициализация карты в модальном окне, если еще не инициализирована
    if (!yandexMapModal && typeof ymaps !== 'undefined') {
        setTimeout(function() {
            initModalMap();
        }, 100);
    } else if (!yandexMapModal) {
        initModalMapPlaceholder();
    }
}

// Закрытие модального окна
function closeMapModal() {
    const mapModal = document.getElementById('mapModal');
    if (!mapModal) return;

    mapModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Инициализация карты в модальном окне
function initModalMap() {
    const mapContainer = document.getElementById('mapModalMap');
    if (!mapContainer) return;

    yandexMapModal = new ymaps.Map('mapModalMap', {
        center: [55.7558, 37.6173], // Москва по умолчанию
        zoom: 12,
        controls: ['zoomControl', 'fullscreenControl', 'geolocationControl']
    });

    // Обработчик клика на карту для выбора адреса
    yandexMapModal.events.add('click', function(e) {
        const coords = e.get('coords');
        
        // Получаем адрес по координатам (обратное геокодирование)
        ymaps.geocode(coords).then(function(res) {
            const firstGeoObject = res.geoObjects.get(0);
            if (firstGeoObject) {
                const address = firstGeoObject.getAddressLine();
                
                // Обновляем поле ввода в модальном окне
                const mapModalInput = document.getElementById('mapModalInput');
                if (mapModalInput) {
                    mapModalInput.value = address;
                }
                
                // Обновляем основное поле ввода
                const addressInput = document.getElementById('addressInput');
                if (addressInput) {
                    addressInput.value = address;
                }
                
                // Обновляем карту с меткой
                updateModalMap(address, true);
            }
        });
    });
}

// Заглушка для карты в модальном окне
function initModalMapPlaceholder() {
    const mapContainer = document.getElementById('mapModalMap');
    if (!mapContainer) return;

    mapContainer.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: linear-gradient(135deg, #E6F2FF 0%, #FFFFFF 100%);">
            <div style="text-align: center; color: #666;">
                <div style="font-size: 48px; margin-bottom: 16px;">🗺️</div>
                <div>Карта будет отображена здесь</div>
                <div style="font-size: 12px; margin-top: 8px; opacity: 0.7;">
                    Для работы карты необходим API ключ Yandex Maps
                </div>
            </div>
        </div>
    `;
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

// Проверка адреса из модального окна
function checkAddressFromModal(address) {
    const checkModalBtn = document.getElementById('checkModalBtn');
    
    if (!checkModalBtn) return;

    // Показываем состояние загрузки
    const originalText = checkModalBtn.textContent;
    checkModalBtn.disabled = true;
    checkModalBtn.textContent = 'ПРОВЕРКА...';

    // Имитация запроса к API
    setTimeout(() => {
        // Случайный результат для демонстрации
        const isAvailable = Math.random() > 0.3; // 70% вероятность доступности
        
        // Обновляем карту в модальном окне
        updateModalMap(address, isAvailable);
        
        // Восстанавливаем кнопку
        checkModalBtn.disabled = false;
        checkModalBtn.textContent = originalText;

        // Показываем модальное окно с результатом
        showAddressResultModal(address, isAvailable);
    }, 1500);
}

// Обновление карты в модальном окне
function updateModalMap(address, isAvailable) {
    if (yandexMapModal) {
            // Используем геокодирование для получения координат
            ymaps.geocode(address).then(function(res) {
                const firstGeoObject = res.geoObjects.get(0);
                if (firstGeoObject) {
                    const coords = firstGeoObject.geometry.getCoordinates();
                    
                yandexMapModal.setCenter(coords, 16);
                    
                    // Удаляем предыдущую метку
                if (mapMarkerModal) {
                    yandexMapModal.geoObjects.remove(mapMarkerModal);
                    }
                    
                    // Добавляем новую метку
                mapMarkerModal = new ymaps.Placemark(coords, {
                        balloonContent: address,
                        iconCaption: isAvailable ? '✓ Доступно' : 'Недоступно'
                    }, {
                        preset: isAvailable ? 'islands#greenDotIcon' : 'islands#redDotIcon'
                    });
                    
                yandexMapModal.geoObjects.add(mapMarkerModal);
                }
            }).catch(function(error) {
                console.error('Ошибка геокодирования:', error);
            });
    }
}

// Инициализация FAQ аккордеона
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.closest('.faq-item');
            const isActive = faqItem.classList.contains('active');
            
            // Закрываем все остальные вопросы
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                }
            });
            
            // Переключаем текущий вопрос
            if (isActive) {
                faqItem.classList.remove('active');
            } else {
                faqItem.classList.add('active');
            }
        });
    });
}

// Анимация статистики поддержки
function initSupportStatsAnimation() {
    const statNumbers = document.querySelectorAll('.advantage-features .support-stat-number');
    
    if (statNumbers.length === 0) return;
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                animateSupportNumber(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
}

function animateSupportNumber(element, target) {
    const duration = 1500;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

