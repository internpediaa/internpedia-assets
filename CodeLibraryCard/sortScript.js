function filterCards(category) {
        // Get all project cards and category buttons
        const cards = document.querySelectorAll('.project-card');
        const buttons = document.querySelectorAll('.category-btn');
        
        // Update active button state
        buttons.forEach(btn => {
          if (btn.getAttribute('onclick').includes(category)) {
            btn.classList.add('active', 'bg-blue-500', 'text-white');
            btn.classList.remove('bg-gray-200', 'text-gray-700', 'dark:bg-gray-700', 'dark:text-gray-200');
          } else {
            btn.classList.remove('active', 'bg-blue-500', 'text-white');
            btn.classList.add('bg-gray-200', 'text-gray-700', 'dark:bg-gray-700', 'dark:text-gray-200');
          }
        });

        // Show/hide cards based on category
        cards.forEach(card => {
          if (category === 'all' || card.dataset.category === category) {
            card.style.display = '';
            card.style.opacity = '1';
          } else {
            card.style.display = 'none';
            card.style.opacity = '0';
          }
        });
      }

      // Initialize with all projects shown
      filterCards('all');
