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

    // Обработчик кнопки "Личный кабинет"
    const cabinetBtn = document.querySelector('.btn-cabinet');
    if (cabinetBtn && !cabinetBtn.hasAttribute('onclick')) {
        cabinetBtn.addEventListener('click', function() {
            window.location.href = 'login.html';
        });
    }

    // Проверка подключения по адресу
    initAddressCheck();
    
    // Инициализация переключателей дополнительных опций
    initTariffAddons();
});

// Функции для проверки адреса
let selectedAddress = null;
let yandexMapCheck = null;
let mapMarkerCheck = null;
let mapMarkers = []; // Массив всех маркеров на карте
let draggableMarker = null; // Перетаскиваемый маркер в центре карты

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
                // Проверка не выполняется автоматически - только по явному клику на кнопку
            }
        } else if (e.key === 'Escape') {
            hideAutocomplete();
        }
    });

    // Обработчик кнопки "Проверить"
    if (checkAddressBtn) {
        checkAddressBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
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
        // Проверяем, что ymaps загружен и доступен
        if (typeof ymaps === 'undefined') {
            // Если ymaps еще не загружен, пробуем снова (максимум 30 раз)
            if (initMap.attempts === undefined) initMap.attempts = 0;
            if (initMap.attempts < 30) {
                initMap.attempts++;
                setTimeout(initMap, 200);
            } else {
                // Если не удалось загрузить после 30 попыток, показываем сообщение
                showMapError(mapContainer, 'Yandex Maps API не загружен. Проверьте подключение к интернету.');
            }
            return;
        }

        // Ждем полной загрузки API
        if (typeof ymaps.ready === 'function') {
            try {
                ymaps.ready(function() {
                    try {
                        // Проверяем, что контейнер все еще существует
                        const container = document.getElementById('addressCheckMap');
                        if (!container) {
                            console.error('Контейнер карты не найден');
                            return;
                        }

                        yandexMapCheck = new ymaps.Map('addressCheckMap', {
                            center: [55.7558, 37.6173], // Москва по умолчанию
                            zoom: 12,
                            controls: ['zoomControl', 'fullscreenControl', 'geolocationControl']
                        });

                        // Создаем draggable-маркер в центре карты после полной загрузки
                        yandexMapCheck.events.add('boundschange', function() {
                            if (!draggableMarker) {
                                createDraggableMarker();
                            }
                        });
                        
                        // Также создаем сразу на случай, если событие не сработает
                        setTimeout(function() {
                            if (!draggableMarker && yandexMapCheck) {
                                createDraggableMarker();
                            }
                        }, 500);

                    } catch (error) {
                        console.error('Ошибка инициализации карты:', error);
                        showMapError(mapContainer, 'Ошибка инициализации карты: ' + error.message);
                    }
                });
            } catch (error) {
                console.error('Ошибка при вызове ymaps.ready:', error);
                showMapError(mapContainer, 'Ошибка загрузки Yandex Maps API.');
            }
        } else {
            // Если ready недоступен, пробуем еще раз
            if (initMap.attempts === undefined) initMap.attempts = 0;
            if (initMap.attempts < 30) {
                initMap.attempts++;
                setTimeout(initMap, 200);
            } else {
                showMapError(mapContainer, 'Yandex Maps API не готов. Проверьте подключение к интернету.');
            }
        }
    }
    
    // Функция для отображения ошибки карты
    function showMapError(container, message) {
        if (!container) return;
        container.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: linear-gradient(135deg, #E6F2FF 0%, #FFFFFF 100%); border-radius: 12px;">
                <div style="text-align: center; color: #666; padding: 20px;">
                    <div style="font-size: 48px; margin-bottom: 16px;">🗺️</div>
                    <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px; color: #0066CC;">Карта недоступна</div>
                    <div style="font-size: 14px; line-height: 1.5;">${message}</div>
                </div>
            </div>
        `;
    }

    // Пробуем инициализировать карту
    // Ждем немного, чтобы убедиться, что DOM полностью загружен
    setTimeout(function() {
        initMap();
    }, 100);

    // Если через 8 секунд карта не загрузилась, показываем заглушку
    setTimeout(function() {
        if (!yandexMapCheck && mapContainer) {
            const errorDiv = mapContainer.querySelector('.map-error-message');
            if (!errorDiv) {
                showMapError(mapContainer, 'Карта не загружена. Проверьте подключение к интернету.');
            }
        }
    }, 8000);
}

// Добавление маркера на карту по координатам
function addMarkerToMap(coords, address, options = {}) {
    if (!yandexMapCheck) return null;

    const {
        iconColor = '#0066CC',
        iconGlyph = 'place',
        preset = 'islands#blueCircleDotIcon',
        balloonContent = null,
        draggable = true
    } = options;

    // Создаем метку
    const marker = new ymaps.Placemark(coords, {
        balloonContent: balloonContent || `<strong>${address}</strong><br>Координаты: ${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}`,
        hintContent: address
    }, {
        iconColor: iconColor,
        iconGlyph: iconGlyph,
        preset: preset,
        draggable: draggable
    });

    // Обработчик перетаскивания маркера
    if (draggable) {
        marker.events.add('dragend', function() {
            const newCoords = marker.geometry.getCoordinates();
            // Проверяем доступность API перед геокодированием
            if (typeof ymaps === 'undefined' || !ymaps || !ymaps.geocode) {
                console.warn('Yandex Maps API не доступен для геокодирования');
                return;
            }
            // Обновляем адрес при перетаскивании
            ymaps.geocode(newCoords).then(function(res) {
                const firstGeoObject = res.geoObjects.get(0);
                if (firstGeoObject) {
                    const newAddress = firstGeoObject.getAddressLine();
                    marker.properties.set('balloonContent', `<strong>${newAddress}</strong><br>Координаты: ${newCoords[0].toFixed(6)}, ${newCoords[1].toFixed(6)}`);
                    marker.properties.set('hintContent', newAddress);
                }
            });
        });
    }

    // Добавляем кнопку удаления в балун
    marker.events.add('balloonopen', function() {
        const originalContent = marker.properties.get('balloonContent');
        const markerId = marker.id;
        marker.properties.set('balloonContent', 
            originalContent + 
            `<br><br><button id="removeMarkerBtn_${markerId}" style="padding: 6px 12px; background: #ff4444; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px;">Удалить маркер</button>`
        );
        
        // Добавляем обработчик после открытия балуна
        setTimeout(function() {
            const removeBtn = document.getElementById(`removeMarkerBtn_${markerId}`);
            if (removeBtn) {
                removeBtn.addEventListener('click', function() {
                    removeMarkerFromMap(markerId);
                    marker.balloon.close();
                });
            }
        }, 100);
    });

    yandexMapCheck.geoObjects.add(marker);
    
    // Генерируем уникальный ID для маркера
    const markerId = `marker_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Сохраняем маркер в массиве
    mapMarkers.push({
        id: markerId,
        marker: marker,
        coords: coords,
        address: address
    });
    
    // Присваиваем ID маркеру для возможности удаления
    marker.id = markerId;

    // Центрируем карту на новом маркере
    yandexMapCheck.setCenter(coords, 15);

    return marker;
}

// Добавление маркера на карту по адресу
function addMarkerByAddress(address, options = {}) {
    // Проверяем, что карта инициализирована
    if (!yandexMapCheck) {
        return Promise.reject(new Error('Карта не инициализирована. Пожалуйста, подождите загрузки карты.'));
    }

    // Проверяем, что ymaps доступен
    if (typeof ymaps === 'undefined' || !ymaps || !ymaps.geocode) {
        return Promise.reject(new Error('Yandex Maps API не загружен или недоступен.'));
    }

    // Нормализуем адрес: добавляем город, если его нет
    let normalizedAddress = address.trim();
    
    // Проверяем, содержит ли адрес название города
    const cityPatterns = ['Москва', 'Санкт-Петербург', 'СПб', 'Питер', 'мск', 'мск.', 'спб', 'спб.'];
    const hasCity = cityPatterns.some(city => 
        normalizedAddress.toLowerCase().includes(city.toLowerCase())
    );
    
    // Если города нет, добавляем Москву по умолчанию
    if (!hasCity) {
        normalizedAddress = 'Москва, ' + normalizedAddress;
    }

    return ymaps.geocode(normalizedAddress).then(function(res) {
        const geoObjects = res.geoObjects;
        
        if (geoObjects.getLength() === 0) {
            console.warn('Адрес не найден:', normalizedAddress);
            // Пробуем найти хотя бы приблизительное местоположение
            return ymaps.geocode(normalizedAddress, { results: 1 }).then(function(res2) {
                if (res2.geoObjects.getLength() > 0) {
                    const firstGeoObject = res2.geoObjects.get(0);
                    const coords = firstGeoObject.geometry.getCoordinates();
                    const foundAddress = firstGeoObject.getAddressLine() || normalizedAddress;
                    const marker = addMarkerToMap(coords, foundAddress, options);
                    // Сохраняем найденный адрес в свойствах маркера
                    marker.properties.set('hintContent', foundAddress);
                    return marker;
                } else {
                    throw new Error('Адрес не найден. Попробуйте указать более полный адрес, например: "Москва, Моховая улица, 15/1с1"');
                }
            });
        }
        
        const firstGeoObject = geoObjects.get(0);
        const coords = firstGeoObject.geometry.getCoordinates();
        const foundAddress = firstGeoObject.getAddressLine();
        
        // Используем найденный адрес или исходный
        const markerAddress = foundAddress || normalizedAddress;
        const marker = addMarkerToMap(coords, markerAddress, options);
        // Сохраняем найденный адрес в свойствах маркера
        marker.properties.set('hintContent', markerAddress);
        
        return marker;
    }).catch(function(error) {
        console.error('Ошибка геокодирования:', error);
        // Пробуем альтернативный вариант поиска
        const alternativeAddress = 'Москва, ' + address;
        return ymaps.geocode(alternativeAddress).then(function(res) {
            if (res.geoObjects.getLength() > 0) {
                const firstGeoObject = res.geoObjects.get(0);
                const coords = firstGeoObject.geometry.getCoordinates();
                const foundAddress = firstGeoObject.getAddressLine() || alternativeAddress;
                const marker = addMarkerToMap(coords, foundAddress, options);
                // Сохраняем найденный адрес в свойствах маркера
                marker.properties.set('hintContent', foundAddress);
                return marker;
            } else {
                throw new Error('Не удалось найти адрес. Проверьте правильность написания.');
            }
        });
    });
}

// Удаление маркера с карты
function removeMarkerFromMap(markerId) {
    if (!yandexMapCheck) return;

    const markerIndex = mapMarkers.findIndex(m => m.id === markerId);
    if (markerIndex !== -1) {
        const markerData = mapMarkers[markerIndex];
        yandexMapCheck.geoObjects.remove(markerData.marker);
        mapMarkers.splice(markerIndex, 1);
    }
}

// Удаление всех маркеров с карты
function clearAllMarkers() {
    if (!yandexMapCheck) return;

    mapMarkers.forEach(markerData => {
        yandexMapCheck.geoObjects.remove(markerData.marker);
    });
    mapMarkers = [];
}

// Создание draggable-маркера в центре карты
function createDraggableMarker() {
    if (!yandexMapCheck || draggableMarker) return;
    
    // Проверяем, что ymaps доступен
    if (typeof ymaps === 'undefined' || !ymaps || !ymaps.Placemark) {
        console.warn('Yandex Maps API не доступен для создания draggable маркера');
        return;
    }

    const center = yandexMapCheck.getCenter();
    const initialAddress = `Координаты: ${center[0].toFixed(6)}, ${center[1].toFixed(6)}`;
    
    // Создаем огромный заметный перетаскиваемый маркер сразу
    draggableMarker = new ymaps.Placemark(center, {
        balloonContent: `<strong>${initialAddress}</strong><br><br>Перетащите маркер для выбора адреса`,
        hintContent: 'Кликните для проверки адреса'
    }, {
        iconLayout: 'default#imageWithContent',
        iconImageHref: 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><circle cx="40" cy="40" r="37" fill="#0066CC" stroke="#FFFFFF" stroke-width="4" opacity="1"/><circle cx="40" cy="40" r="25" fill="#FFFFFF"/><circle cx="40" cy="40" r="13" fill="#0066CC"/></svg>'),
        iconImageSize: [20, 20],
        iconImageOffset: [-40, -40],
        draggable: true,
        openBalloonOnClick: false,
        cursor: 'pointer', // Указываем, что маркер кликабелен
        hasBalloon: false // Отключаем балун полностью
    });
    
    // Добавляем маркер на карту сразу
    yandexMapCheck.geoObjects.add(draggableMarker);
    
    // Обработчик перетаскивания маркера
    draggableMarker.events.add('dragend', function() {
        const newCoords = draggableMarker.geometry.getCoordinates();
        
        // Проверяем доступность API перед геокодированием
        if (typeof ymaps === 'undefined' || !ymaps || !ymaps.geocode) {
            console.warn('Yandex Maps API не доступен для геокодирования');
            return;
        }
        
        // Обновляем адрес при перетаскивании
        ymaps.geocode(newCoords).then(function(res) {
            const firstGeoObject = res.geoObjects.get(0);
            if (firstGeoObject) {
                const newAddress = firstGeoObject.getAddressLine();
                draggableMarker.properties.set('balloonContent', `<strong>${newAddress}</strong><br>Координаты: ${newCoords[0].toFixed(6)}, ${newCoords[1].toFixed(6)}<br><br>Перетащите маркер для выбора адреса`);
                draggableMarker.properties.set('hintContent', newAddress);
                
                // Обновляем поле ввода
                const addressInput = document.getElementById('addressInput');
                if (addressInput) {
                    addressInput.value = newAddress;
                }
            } else {
                const coordsText = `Координаты: ${newCoords[0].toFixed(6)}, ${newCoords[1].toFixed(6)}`;
                draggableMarker.properties.set('balloonContent', `<strong>${coordsText}</strong><br><br>Перетащите маркер для выбора адреса`);
                draggableMarker.properties.set('hintContent', coordsText);
            }
        });
    });

    // Обработчик клика на маркер - заполняем поле ввода и проверяем адрес
    draggableMarker.events.add('click', function(e) {
        console.log('Клик на draggable маркер обнаружен');
        
        // Предотвращаем открытие балуна по умолчанию
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        
        // Закрываем балун сразу, если он открыт
        if (draggableMarker && draggableMarker.balloon) {
            draggableMarker.balloon.close();
        }
        
        const coords = draggableMarker.geometry.getCoordinates();
        console.log('Координаты маркера:', coords);
        
        // Функция для обработки адреса и показа модального окна
        function processAddressAndShowModal(address) {
            console.log('Обрабатываем адрес:', address);
            
            // Обновляем поле ввода
            const addressInput = document.getElementById('addressInput');
            if (addressInput) {
                addressInput.value = address;
            }
            
            // Имитируем проверку адреса и показываем модальное окно
            // Случайный результат для демонстрации (70% вероятность доступности)
            const isAvailable = Math.random() > 0.3;
            console.log('Результат проверки:', isAvailable ? 'доступно' : 'требуется уточнение');
            
            // Показываем модальное окно с результатом
            console.log('Вызываем showAddressResultModal с адресом:', address);
            if (typeof showAddressResultModal === 'function') {
                showAddressResultModal(address, isAvailable);
                console.log('showAddressResultModal вызвана');
            } else {
                console.error('showAddressResultModal не является функцией!');
            }
            
            // Обновляем карту с результатом проверки
            if (typeof updateAddressCheckMap === 'function') {
                updateAddressCheckMap(address, isAvailable);
            }
        }
        
        // Проверяем доступность API перед геокодированием
        if (typeof ymaps === 'undefined' || !ymaps || !ymaps.geocode) {
            console.warn('Yandex Maps API не доступен для геокодирования');
            // Показываем модальное окно с координатами без геокодирования
            const address = `Координаты: ${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}`;
            processAddressAndShowModal(address);
            return;
        }
        
        // Проверяем доступность API перед геокодированием
        if (typeof ymaps === 'undefined' || !ymaps || !ymaps.geocode) {
            console.warn('Yandex Maps API не доступен для геокодирования');
            // Показываем модальное окно с координатами без геокодирования
            const address = `Координаты: ${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}`;
            const isAvailable = Math.random() > 0.3;
            if (typeof showAddressResultModal === 'function') {
                showAddressResultModal(address, isAvailable);
            }
            return;
        }
        
        // Получаем адрес по координатам
        ymaps.geocode(coords, {
            results: 1
        }).then(function(res) {
            console.log('Геокодирование выполнено');
            const firstGeoObject = res.geoObjects.get(0);
            let address;
            
            if (firstGeoObject) {
                address = firstGeoObject.getAddressLine();
                console.log('Найден адрес:', address);
            } else {
                address = `Координаты: ${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}`;
                console.log('Адрес не найден, используем координаты');
            }
            
            processAddressAndShowModal(address);
        }).catch(function(error) {
            console.warn('Ошибка геокодирования при клике на маркер:', error);
            // Даже при ошибке показываем модальное окно с координатами
            const address = `Координаты: ${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}`;
            processAddressAndShowModal(address);
        });
        
        return false; // Предотвращаем дальнейшую обработку события
    });
    
    // Предотвращаем открытие балуна при клике
    draggableMarker.events.add('balloonopen', function(e) {
        e.stopPropagation();
        if (draggableMarker && draggableMarker.balloon) {
            draggableMarker.balloon.close();
        }
    });
    
    // Альтернативный обработчик через событие карты для надежности
    let isDragging = false;
    let dragStartTime = 0;
    
    draggableMarker.events.add('dragstart', function() {
        isDragging = true;
        dragStartTime = Date.now();
    });
    
    draggableMarker.events.add('dragend', function() {
        const dragDuration = Date.now() - dragStartTime;
        // Если перетаскивание было очень коротким (менее 100мс), считаем это кликом
        if (dragDuration < 100) {
            console.log('Короткое перетаскивание, обрабатываем как клик');
            setTimeout(function() {
                const coords = draggableMarker.geometry.getCoordinates();
                handleMarkerClick(coords);
            }, 50);
        }
        // Сбрасываем флаг после задержки
        setTimeout(function() {
            isDragging = false;
        }, 200);
    });
    
    // Выносим логику обработки клика в отдельную функцию для переиспользования
    function handleMarkerClick(coords) {
        console.log('Обработка клика на маркере, координаты:', coords);
        
        // Закрываем балун, если он открыт
        if (draggableMarker && draggableMarker.balloon) {
            draggableMarker.balloon.close();
        }
        
        // Получаем адрес по координатам
        if (typeof ymaps === 'undefined' || !ymaps || !ymaps.geocode) {
            console.warn('Yandex Maps API не доступен для геокодирования');
            // Показываем модальное окно с координатами без геокодирования
            const address = `Координаты: ${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}`;
            const isAvailable = Math.random() > 0.3;
            if (typeof showAddressResultModal === 'function') {
                showAddressResultModal(address, isAvailable);
            }
            return;
        }
        
        ymaps.geocode(coords, {
            results: 1
        }).then(function(res) {
            console.log('Геокодирование выполнено');
            const firstGeoObject = res.geoObjects.get(0);
            let address;
            
            if (firstGeoObject) {
                address = firstGeoObject.getAddressLine();
                console.log('Найден адрес:', address);
            } else {
                address = `Координаты: ${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}`;
                console.log('Адрес не найден, используем координаты');
            }
            
            // Обновляем поле ввода
            const addressInput = document.getElementById('addressInput');
            if (addressInput) {
                addressInput.value = address;
            }
            
            // Имитируем проверку адреса и показываем модальное окно
            const isAvailable = Math.random() > 0.3;
            console.log('Результат проверки:', isAvailable ? 'доступно' : 'требуется уточнение');
            console.log('Вызываем showAddressResultModal с адресом:', address);
            
            // Показываем модальное окно с результатом
            if (typeof showAddressResultModal === 'function') {
                showAddressResultModal(address, isAvailable);
                console.log('showAddressResultModal вызвана');
            } else {
                console.error('showAddressResultModal не является функцией!');
            }
            
            // Обновляем карту с результатом проверки
            if (typeof updateAddressCheckMap === 'function') {
                updateAddressCheckMap(address, isAvailable);
            }
        }).catch(function(error) {
            console.warn('Ошибка геокодирования при клике на маркер:', error);
            // Даже при ошибке показываем модальное окно с координатами
            const address = `Координаты: ${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}`;
            const isAvailable = Math.random() > 0.3;
            if (typeof showAddressResultModal === 'function') {
                showAddressResultModal(address, isAvailable);
            }
            if (typeof updateAddressCheckMap === 'function') {
                updateAddressCheckMap(address, isAvailable);
            }
        });
    }
    
    // Обновляем обработчик клика, чтобы использовать общую функцию
    draggableMarker.events.remove('click');
    draggableMarker.events.add('click', function(e) {
        console.log('Клик на draggable маркер обнаружен (событие click)');
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        const coords = draggableMarker.geometry.getCoordinates();
        handleMarkerClick(coords);
        return false;
    });
    
    // Получаем адрес по координатам центра (асинхронно)
    if (typeof ymaps !== 'undefined' && ymaps && ymaps.geocode) {
        ymaps.geocode(center).then(function(res) {
            const firstGeoObject = res.geoObjects.get(0);
            if (firstGeoObject && draggableMarker) {
                const address = firstGeoObject.getAddressLine();
                draggableMarker.properties.set('balloonContent', `<strong>${address}</strong><br>Координаты: ${center[0].toFixed(6)}, ${center[1].toFixed(6)}<br><br>Перетащите маркер для выбора адреса`);
                draggableMarker.properties.set('hintContent', address);
            }
        }).catch(function(error) {
            console.warn('Ошибка геокодирования для draggable маркера:', error);
            // Не критично, просто не обновляем адрес
        });
    }
}

// Обновление карты в блоке проверки адреса
function updateAddressCheckMap(address, isAvailable) {
    if (!yandexMapCheck) return;
    
    // Проверяем, что ymaps доступен
    if (typeof ymaps === 'undefined' || !ymaps || !ymaps.geocode) {
        console.warn('Yandex Maps API не доступен для геокодирования');
        return;
    }

    // Удаляем предыдущую метку проверки
    if (mapMarkerCheck) {
        yandexMapCheck.geoObjects.remove(mapMarkerCheck);
    }

    // Получаем координаты адреса
    ymaps.geocode(address).then(function(res) {
        const firstGeoObject = res.geoObjects.get(0);
        if (firstGeoObject) {
            const coords = firstGeoObject.geometry.getCoordinates();
            
            // Создаем большую заметную метку для проверки адреса
            const iconColor = isAvailable ? '#4CAF50' : '#FF9800';
            const iconGlyph = isAvailable ? 'check' : 'warning';
            
            // Создаем большую кастомную иконку
            const iconSvg = isAvailable 
                ? '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4CAF50" stroke="#FFFFFF" stroke-width="4" opacity="1"/><circle cx="32" cy="32" r="20" fill="#FFFFFF"/><path d="M20 32 L28 40 L44 24" stroke="#4CAF50" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>'
                : '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#FF9800" stroke="#FFFFFF" stroke-width="4" opacity="1"/><circle cx="32" cy="32" r="20" fill="#FFFFFF"/><path d="M32 20 L32 44 M20 32 L44 32" stroke="#FF9800" stroke-width="5" stroke-linecap="round"/></svg>';
            
            mapMarkerCheck = new ymaps.Placemark(coords, {
                balloonContent: `<strong>${address}</strong><br>${isAvailable ? 'Подключение доступно' : 'Требуется уточнение'}`
            }, {
                iconLayout: 'default#imageWithContent',
                iconImageHref: 'data:image/svg+xml;base64,' + btoa(iconSvg),
                iconImageSize: [64, 64],
                iconImageOffset: [-32, -32],
                draggable: false
            });

            yandexMapCheck.geoObjects.add(mapMarkerCheck);
            
            // Плавно перемещаем карту к адресу с анимацией
            yandexMapCheck.setCenter(coords, 15, {
                duration: 1000
            });
            
            // Небольшая задержка перед открытием балуна для плавности
            setTimeout(function() {
                if (mapMarkerCheck && mapMarkerCheck.balloon) {
                    mapMarkerCheck.balloon.open();
                }
            }, 500);
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
                // Проверка не выполняется автоматически - только по явному клику на кнопку
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

// Показ модального окна с результатом проверки адреса
function showAddressResultModal(address, isAvailable) {
    // Создаем модальное окно, если его еще нет
    let modal = document.getElementById('addressResultModal');
    
    if (!modal) {
        // Создаем структуру модального окна
        modal = document.createElement('div');
        modal.id = 'addressResultModal';
        modal.className = 'address-result-modal';
        modal.innerHTML = `
            <div class="address-result-modal-overlay"></div>
            <div class="address-result-modal-content">
                <button class="address-result-modal-close" aria-label="Закрыть">&times;</button>
                <div class="address-result-modal-body">
                    <div class="address-result-icon"></div>
                    <h3 class="address-result-title"></h3>
                    <p class="address-result-address"></p>
                    <p class="address-result-message"></p>
                    <button class="address-result-btn">Оставить заявку</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Обработчики закрытия модального окна
        const closeBtn = modal.querySelector('.address-result-modal-close');
        const overlay = modal.querySelector('.address-result-modal-overlay');
        const okBtn = modal.querySelector('.address-result-btn');
        
        const closeModal = function() {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        };
        
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (overlay) overlay.addEventListener('click', closeModal);
        
        // Обработчик кнопки "Оставить заявку" - переход на страницу заявки
        if (okBtn) {
            okBtn.addEventListener('click', function() {
                // Получаем адрес из модального окна
                const addressElement = modal.querySelector('.address-result-address');
                const address = addressElement ? addressElement.textContent.trim() : '';
                
                // Переход на страницу заявки с передачей адреса
                let url = 'application.html';
                if (address) {
                    url += '?address=' + encodeURIComponent(address);
                }
                window.location.href = url;
            });
        }
        
        // Закрытие по Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }
    
    // Обновляем содержимое модального окна
    const icon = modal.querySelector('.address-result-icon');
    const title = modal.querySelector('.address-result-title');
    const addressEl = modal.querySelector('.address-result-address');
    const message = modal.querySelector('.address-result-message');
    
    // Формируем текст с информацией о доступности
    let availabilityText = '';
    if (isAvailable) {
        icon.innerHTML = '✓';
        icon.className = 'address-result-icon success';
        title.textContent = 'Подключение доступно!';
        availabilityText = 'На этом адресе доступно подключение.';
        message.textContent = availabilityText + ' Мы можем подключить интернет по указанному адресу. Свяжитесь с нами для уточнения деталей подключения.';
    } else {
        icon.innerHTML = '⚠';
        icon.className = 'address-result-icon warning';
        title.textContent = 'Требуется уточнение';
        availabilityText = 'На этом адресе недоступно подключение.';
        message.textContent = availabilityText + ' Для данного адреса требуется дополнительная проверка возможности подключения. Наш специалист свяжется с вами для уточнения деталей.';
    }
    
    // Если адрес содержит координаты, заменяем их на текст о доступности
    if (address.startsWith('Координаты:')) {
        addressEl.textContent = availabilityText;
    } else {
        addressEl.textContent = address;
    }
    
    // Показываем модальное окно
    modal.style.display = 'block';
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
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