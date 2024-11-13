const progressCircles = document.querySelectorAll('.progress-circle');

const animateProgress = (circle) => {
    const progress = circle.getAttribute('data-progress');
    const offset = 314 - (progress / 100 * 314); // 314 is the circumference of the circle (2 * Math.PI * 110)
    const progressCircle = circle.querySelector('.progress');
    progressCircle.style.strokeDashoffset = offset;
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const circle = entry.target;
            animateProgress(circle);
            observer.unobserve(circle); // Stop observing after animation
        }
    });
}, { threshold: 0.5 }); // Trigger when 50% of the circle is in view

progressCircles.forEach(circle => {
    observer.observe(circle);
});

new CircleProgress('.progress', {
	max: 100,
	value: 60,
	textFormat: 'percent',
});


document.addEventListener("DOMContentLoaded", function() {
    const container = document.querySelector(".progress-container");
    const progressText = container.querySelector(".progress-text");
    const progressCircle = container.querySelector(".progress-circle");

    // Extract values from custom properties
    const size = parseFloat(getComputedStyle(container).getPropertyValue("--size")) || 200;
    const strokeWidth = parseFloat(getComputedStyle(container).getPropertyValue("--stroke-width")) || 8;
    const percentage = parseFloat(getComputedStyle(container).getPropertyValue("--percentage")) || 41;
    const color = getComputedStyle(container).getPropertyValue("--color") || "#1a1a2e";

    const center = size / 2;
    const radius = center - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;

    // Set up the SVG and styles
    progressCircle.setAttribute("r", radius);
    progressCircle.setAttribute("cx", center);
    progressCircle.setAttribute("cy", center);
    progressCircle.setAttribute("stroke-width", strokeWidth);
    progressCircle.setAttribute("stroke-dasharray", circumference);
    progressCircle.style.stroke = color;

    // Animate the progress
    let progress = 0;
    const animateProgress = () => {
      if (progress < percentage) {
        progress += 1;
        const offset = circumference - (progress / 100) * circumference;
        progressCircle.setAttribute("stroke-dashoffset", offset);
        progressText.textContent = `${progress}%`;
        requestAnimationFrame(animateProgress);
      }
    };

    animateProgress();
  });

  $(function() {
    AOS.init();
  });
  window.addEventListener('load', AOS.refresh)