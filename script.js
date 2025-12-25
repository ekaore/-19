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
});

// Функции для проверки адреса
let selectedAddress = null;
let yandexMapModal = null;
let mapMarkerModal = null;

function initAddressCheck() {
    const addressInput = document.getElementById('addressInput');
    const checkAddressBtn = document.getElementById('checkAddressBtn');
    const openMapLink = document.getElementById('openMapLink');

    if (!addressInput) return;

    // Обработчик кнопки "Проверить"
    if (checkAddressBtn) {
        checkAddressBtn.addEventListener('click', function() {
            const address = addressInput.value.trim();
            if (address) {
                checkAddress(address);
            } else {
                alert('Пожалуйста, введите адрес');
            }
        });
    }

    // Обработчик Enter в поле ввода
    addressInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const address = this.value.trim();
            if (address) {
                checkAddress(address);
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

        // Показываем результат
        alert(isAvailable ? 
            `✓ Подключение доступно по адресу: ${address}` : 
            `Пока не подключены к адресу: ${address}`
        );
    }, 1500);
}

// Инициализация модального окна с картой
function initMapModal() {
    const mapModal = document.getElementById('mapModal');
    const mapModalClose = document.getElementById('mapModalClose');
    const checkModalBtn = document.getElementById('checkModalBtn');
    const mapModalInput = document.getElementById('mapModalInput');

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

    // Обработчик кнопки "ПРОВЕРИТЬ" в модальном окне
    if (checkModalBtn) {
        checkModalBtn.addEventListener('click', function() {
            const address = mapModalInput ? mapModalInput.value.trim() : '';
            if (address) {
                checkAddressFromModal(address);
            }
        });
    }

    // Enter в поле ввода модального окна
    if (mapModalInput) {
        mapModalInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const address = this.value.trim();
                if (address) {
                    checkAddressFromModal(address);
                }
            }
        });
    }
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

        // Показываем результат
        alert(isAvailable ? 
            `✓ Подключение доступно по адресу: ${address}` : 
            `Пока не подключены к адресу: ${address}`
        );
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

