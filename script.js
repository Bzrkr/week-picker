 async function fetchJson(url) {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            return await response.json();
        }

        async function getCurrentWeek() {
            try {
                const currentWeek = await fetchJson('https://iis.bsuir.by/api/v1/schedule/current-week');
                return currentWeek;
            } catch (error) {
                console.error('Ошибка при получении  недели:', error);
                return null;
            }
        }

        function formatDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }

        function getWeekNumber(currentWeek, diffDays) {
            let weekNumber = ((currentWeek - 1) + Math.floor(diffDays / 7)) % 4 + 1;
            if (weekNumber <= 0) {
                weekNumber += 4;
            }
            return weekNumber;
        }

        function getStartOfWeek(date) {
            const day = date.getDay();
            const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Понедельник
            return new Date(date.setDate(diff));
        }

        async function init() {
            const currentWeek = await getCurrentWeek();
            if (currentWeek === null) {
                document.getElementById('weekDisplay').textContent = 'Не удалось загрузить  неделю';
                return;
            }

            const datePicker = document.getElementById('datePicker');
            const weekDisplay = document.getElementById('weekDisplay');
            const weekDisplay2 = document.getElementById('weekDisplay2');

            
            // Устанавливаем текущую дату в datePicker
            const today = new Date();
            datePicker.value = formatDate(today);

            datePicker.addEventListener('change', function() {
                const selectedDate = new Date(this.value);
                
                // Устанавливаем время в 00:00:00 для точного сравнения
                selectedDate.setHours(0, 0, 0, 0);
                today.setHours(0, 0, 0, 0);

                // Вычисляем начало текущей недели и выбранной недели
                const startOfCurrentWeek = getStartOfWeek(today);
                const startOfSelectedWeek = getStartOfWeek(selectedDate);

                // Вычисляем количество дней между началом выбранной недели и началом текущей недели
                const diffTime = startOfSelectedWeek - startOfCurrentWeek;
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                // Вычисляем номер недели
                const weekNumber = getWeekNumber(currentWeek, diffDays);

                weekDisplay.textContent = `${weekNumber}-я учебная неделя`;
            });

            weekDisplay.textContent = `${currentWeek}-я учебная неделя`;
            weekDisplay2.textContent = `Сегодня: ${formatDate(today)}`;
        }

        init();
