<script>
    import { onMount } from 'svelte';
    import { initCanvas, startDrawing, draw, stopDrawing, clearCanvas } from '$lib/canvas.js';  
    let canvas;

    // Results
    let ocrResults = null;
    let isLoading = false;
    let cooldownRemaining = 0;
    
    let modelResults = {
        Tesseract: {output: "Not ran yet!"},
        TrOCR: {output: "This is too slow for free demo :("}
    };

    onMount(() => {
        if (canvas) {
            initCanvas(canvas);
        }
    });

    async function handleSubmit() {
        isLoading = true;
        const imageData = canvas.toDataURL('image/png');

        try {
            const response = await fetch('https://ocrbackend-production-cd1c.up.railway.app/ocr', {
            //const response = await fetch('http://localhost:8000/ocr', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: imageData.split(',')[1],
                })
            });

            const data = await response.json();

        } catch (error) {
            console.error('Error:', error);
            // Mock response for demo
        }
        isLoading = false;
        cooldownRemaining = 5;
        const interval = setInterval(() => {
            cooldownRemaining--;
            if (cooldownRemaining <= 0) {
                clearInterval(interval);
                if (data.model_results) {
                    modelResults = { ...modelResults, ...data.model_results };
                    console.log("assigned")
                } else {
                    console.warn("API response is missing 'model_results' key. Using mock data for display.");
                } 
            }
        }, 1000);
    }
    let activeModel = 'Tesseract';
    $: currentResults = modelResults[activeModel];
    const modelKeys = Object.keys(modelResults);
</script>

<main>
    <h1>OCR Form Demo</h1>

    <div class="container">
        <!-- Drawing Canvas -->
        <section class="card">
            <h2>Fill in your form please! ✏️</h2>
            <canvas
                    bind:this={canvas}
                    id="canvas"
                    width="600"
                    height="400"
                    onmousedown={startDrawing}
                    onmousemove={draw}
                    onmouseup={stopDrawing}
                    onmouseleave={stopDrawing}

                    ontouchstart={startDrawing}
                    ontouchmove={draw}
                    ontouchend={stopDrawing}
                    ontouchcancel={stopDrawing}
                    style="touch-action: none;"
                    ></canvas>
            <div class="buttons">
                <button class="clear-btn" onclick={clearCanvas}>🗘 Clear Canvas</button>
                <button class="submit-btn" id="submitBtn" onclick={handleSubmit} disabled={isLoading || cooldownRemaining > 0}>
                    Run OCR
                </button>
            </div>

        </section>

    </div>


    <!-- Results -->
    {#if modelResults}
        <div id="results">
            <div class="tabs-header">
                {#each modelKeys as key}
                    <button
                        class:active={key === activeModel}
                        onclick={() => (activeModel = key)}
                    >
                        {key}
                    </button>
                {/each}
            </div>
            <div class="tabs-content">
                {#if currentResults}
                    <p>{currentResults.output}</p>
                {:else}
                    <p>Select a model to view results.</p>
                {/if}
            </div>
        </div>
    {/if}
</main>

<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    :global(html) {
        background: #995d71;
        background: radial-gradient(circle, rgba(153, 93, 113, 1) 0%, rgba(29, 42, 74, 1) 89%);
    }


    /* Main title */
    h1 {
        text-align: center;
        margin: auto;
        color: white;
        font-weight: 690;
        animation: lights 5s 750ms linear infinite;
    }

    /* Container for the two columns */
    .container {
        max-width: 1000px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        grid-template-columns: 1fr 1fr;
        gap: 30px;
    }

    /* Card styling */
    .card {
        background: rgba(255,255,255,0.1);
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .card h2 {
        font-size: 1.2rem;
        font-weight: 300;
        color: white;
    }

    .tabs-header{
        display: flex;
        border-bottom: 2px solid rgba(255,255,255,0.3);
    }
    
    .tabs-header button {
        font-size: 1em;
        transition: background-color 0.2s, color 0.2s;
        position: relative;
        border-bottom: none;
        border-radius: 0;
    }

    .tabs-header button:hover {
        background-color: #ddd;
        color: #000;
    }

    .tabs-header button.active {
        background-color: #C73060;
    }

    .tabs-header button:first-child {
        border-top-left-radius: 8px; /* Apply only top-left radius */
    }

    .tabs-header button:last-child {
        border-top-right-radius: 8px; /* Apply only top-right radius */
    }

    /* Canvas */
    canvas {
        border: 2px solid #ddd;
        border-radius: 4px;
        cursor: url('/pencil.cur') 0 0, crosshair;
        display: block;
        margin-bottom: 15px;
    }

    /* Buttons */
    button {
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
    }

    .buttons {
        display: flex;
        justify-content: flex-end;
    }

    .clear-btn {
        background-color: #C73060;
        color: white;
    }

    .clear-btn:hover {
        background-color: #DE356B;
    }

    
    .submit-btn {
        /* Required for pseudo-elements to align correctly */
        position: relative;
        z-index: 0;
        
        /* Ensure the button has a defined size, border, and radius */
        padding: 10px 20px; /* Using your existing padding/size */
        border: none;
        border-radius: 4px; /* Use your preferred radius */
        cursor: pointer;
        
        /* Existing Styles */
        background-color: #C73060; /* This will be covered by the ::after layer */
        color: white;
        margin-left: 10px;
        
        /* You can keep a subtle box-shadow, but the animated glow will dominate */
        box-shadow: 0px 0px 10px rgba(171,255,255,0.3); 
        
        /* Smooth Transition for the hover lift */
        transition: transform 0.2s ease-out, color 0.3s ease;
    }

    .submit-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: translateY(-1px);
    }

    .submit-btn:disabled:before {
        /* When hovered, make the rainbow glow visible */
        opacity: 1;
    }

/* 2. Glow Layer (::before) - The Animated Rainbow */
/* This layer is positioned slightly outside the button and is initially hidden (opacity: 0) */
    .submit-btn:before {
        content: '';
        /* The rainbow gradient that will move */
        background: linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000);
        position: absolute;
        top: -2px;
        left: -2px;
        
        /* Key for the animation: makes the gradient much larger than the button */
        background-size: 400%;
        
        /* The blur effect that creates the "glow" */
        filter: blur(5px); 
        
        /* Make it slightly larger than the button */
        width: calc(100% + 4px);
        height: calc(100% + 4px);
        
        /* Start the perpetual animation */
        animation: glowing 20s linear infinite;
        
        /* Initially hidden */
        opacity: 0; 
        transition: opacity .3s ease-in-out;
        border-radius: 4px; /* Matches button radius */
        z-index: -1; /* Needs to be behind the button's background */
    }

/* 3. Inner Layer (::after) - The Solid Button Background */
/* This layer covers the rainbow background and ensures the button remains a solid color */
    .submit-btn:after {
        z-index: -1; /* Needs to be in front of ::before but behind the button text */
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        
        /* Use your original background color for the button interior */
        background: #C73060; 
        left: 0;
        top: 0;
        border-radius: 4px;
        
        /* Add a transition so the color can change quickly on hover/active */
        transition: background-color 0.3s;
    }

    /* 4. Hover States (Activation) */

    .submit-btn:hover {
        /* Lift the button and activate the rainbow glow */
        transform: translateY(-1px);
    }

    .submit-btn:hover:before {
        /* When hovered, make the rainbow glow visible */
        opacity: 1;
    }

/* 5. Active/Click State */

    .submit-btn:active {
        /* When clicked, push it down slightly */
        transform: translateY(0); 
        
        /* Optional: Change text color on click */
        color: #000;
    }

    .submit-btn:active:after {
        /* When clicked, change the button's inner background color */
        background: #DE356B; /* Your hover background color */
    }


    /* 6. Keyframes for Animation */
    @keyframes glowing {
        0% { background-position: 0 0; }
        50% { background-position: 400% 0; } /* Moves the large gradient horizontally */
        100% { background-position: 0 0; }
    }

    @keyframes lights {   
      0% {
        color: hsl(230, 40%, 80%);
        text-shadow:
          0 0 1em hsla(320, 100%, 50%, 0.2),
          0 0 0.125em hsla(320, 100%, 60%, 0.3),
          -1em -0.125em 0.5em hsla(40, 100%, 60%, 0),
          1em 0.125em 0.5em hsla(200, 100%, 60%, 0);
      }
      
      30% { 
        color: hsl(230, 80%, 90%);
        text-shadow:
          0 0 1em hsla(320, 100%, 50%, 0.5),
          0 0 0.125em hsla(320, 100%, 60%, 0.5),
          -0.5em -0.125em 0.25em hsla(40, 100%, 60%, 0.2),
          0.5em 0.125em 0.25em hsla(200, 100%, 60%, 0.4);
      }
      
      40% { 
        color: hsl(230, 100%, 95%);
        text-shadow:
          0 0 1em hsla(320, 100%, 50%, 0.5),
          0 0 0.125em hsla(320, 100%, 90%, 0.5),
          -0.25em -0.125em 0.125em hsla(40, 100%, 60%, 0.2),
          0.25em 0.125em 0.125em hsla(200, 100%, 60%, 0.4);
      }
      
      70% {
        color: hsl(230, 80%, 90%);
        text-shadow:
          0 0 1em hsla(320, 100%, 50%, 0.5),
          0 0 0.125em hsla(320, 100%, 60%, 0.5),
          0.5em -0.125em 0.25em hsla(40, 100%, 60%, 0.2),
          -0.5em 0.125em 0.25em hsla(200, 100%, 60%, 0.4);
      }
      
      100% {
        color: hsl(230, 40%, 80%);
        text-shadow:
          0 0 1em hsla(320, 100%, 50%, 0.2),
          0 0 0.125em hsla(320, 100%, 60%, 0.3),
          1em -0.125em 0.5em hsla(40, 100%, 60%, 0),
          -1em 0.125em 0.5em hsla(200, 100%, 60%, 0);
      }
      
    }

    /* Results section */
    #results {
        max-width: 600px;
        margin: 40px auto;
        background: rgba(255, 255, 255, 0.05);
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    /* Responsive design */
    @media (max-width: 768px) {
        .container,
        .comparison {
            grid-template-columns: 1fr;
        }
    }
</style>
