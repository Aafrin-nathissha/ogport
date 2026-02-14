document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.interactive-container');
    const target = document.querySelector('.content-wrapper');
    const background = document.querySelector('.background-image');
    // Select all hover text elements to update their masks individually
    const hoverTexts = document.querySelectorAll('.text-hover');


    // Configuration
    const config = {
        tracking: -1,       // Mouse tracking direction/multiplier
        axes: 'both',       // 'x', 'y', or 'both'
        momentum: 30,       // Higher value = smoother/slower (simulating mass/friction)
        tiltMax: 5,          // Maximum tilt in degrees
        bgParallax: 20       // Pixels to move background
    };

    // State
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0; // Text rotation Y
    let currentY = 0; // Text rotation X
    let currentBgX = 0; // Background X
    let currentBgY = 0; // Background Y

    // Window center
    let windowCenterX = window.innerWidth / 2;
    let windowCenterY = window.innerHeight / 2;

    // Update center on resize
    window.addEventListener('resize', () => {
        windowCenterX = window.innerWidth / 2;
        windowCenterY = window.innerHeight / 2;
    });

    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Spotlight Effect Logic: Update custom vars on EACH hover element
        hoverTexts.forEach(el => {
            const rect = el.getBoundingClientRect();
            // Calculate cursor position relative to THIS element
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            el.style.setProperty('--x', `${x}px`);
            el.style.setProperty('--y', `${y}px`);
        });
    });

    // Animation loop
    function animate() {
        // Calculate distance from center (-1 to 1)
        const distX = (mouseX - windowCenterX) / windowCenterX;
        const distY = (mouseY - windowCenterY) / windowCenterY;

        // Target rotation based on mouse position
        // If tracking is -1, element tilts AWAY from mouse
        const targetRotateY = distX * config.tiltMax * config.tracking; // Rotate Y axis tilts horizontally
        const targetRotateX = -distY * config.tiltMax * config.tracking; // Rotate X axis tilts vertically (inverted Y for natural feel)

        // Foreground Movement (Text)
        const moveRange = 50;
        const targetMoveX = distX * moveRange * config.tracking;
        const targetMoveY = distY * moveRange * config.tracking;

        // Background Target Movement (Depth Effect)
        const targetBgX = distX * config.bgParallax;
        const targetBgY = distY * config.bgParallax;

        // Smooth interpolation (Momentum)
        // A lower factor in linear interpolation makes it slower/smoother.
        // We can approximate "Momentum 30" by using a small lerp factor.
        // Assuming 60fps, a higher "Momentum" usually means more "weight", so slower reaction.
        const lerpFactor = 1 / config.momentum;

        // Update Text
        currentX += (targetRotateY - currentX) * lerpFactor;
        currentY += (targetRotateX - currentY) * lerpFactor;

        // Update Background (Smooth movement)
        currentBgX += (targetBgX - currentBgX) * lerpFactor;
        currentBgY += (targetBgY - currentBgY) * lerpFactor;

        // Apply transform to Text (Foreground)
        // Preserving the initial centering translate(-50%, -50%)
        target.style.transform = `translate(calc(-50% + ${targetMoveX}px), calc(-50% + ${targetMoveY}px))
                                  rotateX(${currentY}deg)
                                  rotateY(${currentX}deg)`;

        // Apply transform to Background
        // Keep scale(1.1) to avoid edges
        background.style.transform = `translate(${currentBgX}px, ${currentBgY}px) scale(1.1)`;

        requestAnimationFrame(animate);
    }

    animate();
});
