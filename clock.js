document.addEventListener('DOMContentLoaded', () => {
    const numberOfClocks = 6; 
    const clocksContainer = document.getElementById('clocks-container'); 
    // Loop to create multiple clocks
    for (let i = 0; i < numberOfClocks; i++) {
        // Create a new clock container
        const clockContainer = document.createElement('div');
        clockContainer.classList.add('clock-container');

        // Create child elements for the clock
        for (let j = 1; j <= 12; j++) {
            const number = document.createElement('div');
            number.classList.add('number');
            number.style.setProperty('--n', j);
            number.textContent = j;
            clockContainer.appendChild(number);
        }
        // Create hour hand
        const hourHand = document.createElement('div');
        hourHand.id = 'hour-hand';
        clockContainer.appendChild(hourHand);
        // Create minute hand
        const minuteHand = document.createElement('div');
        minuteHand.id = 'minute-hand';
        clockContainer.appendChild(minuteHand);
        // Create second hand
        const secondHand = document.createElement('div');
        secondHand.id = 'second-hand';
        clockContainer.appendChild(secondHand);
        // Create center dot
        const centerDot = document.createElement('div');
        centerDot.id = 'center-dot';
        clockContainer.appendChild(centerDot);
        // Append the clock container to the clocks container
        clocksContainer.appendChild(clockContainer);
    }

    const clockContainers = document.querySelectorAll('.clock-container');
    clockContainers.forEach(clockContainer => {
        const hourhand = clockContainer.querySelector('#hour-hand');
        const minutehand = clockContainer.querySelector('#minute-hand');
        const secondhand = clockContainer.querySelector('#second-hand');
        function clocktick(){
            const date=new Date();
            const seconds=date.getSeconds()/60;
            const minutes=date.getMinutes()/60;
            const hours=date.getHours()/12;
            rotateclockhand(secondhand,seconds);
            rotateclockhand(minutehand,minutes);
            rotateclockhand(hourhand,hours);
        }
        function rotateclockhand(element,rotation){
            element.style.setProperty('--rotate',rotation*360);
        }
        // Update clock every second
        setInterval(clocktick, 1000);

        // Initial update to set clock hands to current time
        clocktick();
    });

    // Adjust dropdown styles based on window width
    function adjustDropdownStyles() {
        const dropbtns = document.querySelectorAll('.dropbtn');
        const dropdownLinks = document.querySelectorAll('.dropdown-content a, .sub-dropdown-content a');
        const dropdownContents = document.querySelectorAll('.dropdown-content, .sub-dropdown-content');
    
        if (window.innerWidth < 600) {
            dropbtns.forEach(btn => {
                btn.classList.add('small-size');
            });
    
            dropdownLinks.forEach(link => {
                link.classList.add('small-size');
            });
    
            dropdownContents.forEach(content => {
                content.classList.add('small-size');
            });
        } else {
            dropbtns.forEach(btn => {
                btn.classList.remove('small-size');
            });
    
            dropdownLinks.forEach(link => {
                link.classList.remove('small-size');
            });
    
            dropdownContents.forEach(content => {
                content.classList.remove('small-size');
            });
        }
    }
    

    // Initial adjustment on page load
    adjustDropdownStyles();

    // Listen for window resize events to adjust styles
    window.addEventListener('resize', adjustDropdownStyles);
});
