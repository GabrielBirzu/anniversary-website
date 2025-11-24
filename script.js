// Prevent default scrolling for arrow keys and space
window.addEventListener("keydown", function (e) {
    const keysToBlock = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "];
    if (keysToBlock.includes(e.key)) e.preventDefault();
}, { passive: false });

// DOM elements
const character = document.getElementById("character");
const item1 = document.getElementById("item");
const item2 = document.getElementById("item2");
const target1 = document.getElementById("item3");
const item4 = document.getElementById("item4");
const item5 = document.getElementById("item5"); // letter
const item6 = document.getElementById("item6"); // gift
const quest = document.getElementById("quest");

const letterBox1 = document.getElementById("letterBox");
const letterText1 = document.getElementById("letterText");
const closeLetterBtn1 = document.getElementById("closeLetterBtn");

const letterBox2 = document.getElementById("letterBox2");
const letterText2 = document.getElementById("letterText2");
const closeLetterBtn2 = document.getElementById("closeLetterBtn2");

// Initial states
item4.style.opacity = "0";
item5.style.opacity = "0";
item5.style.pointerEvents = "auto";
item6.style.opacity = "0";
item6.style.pointerEvents = "auto";

// Character state
let charX = 10, charY = 36;
let walking = false;
let holdingItem = null;
let canDrop = true;
let itemPlaced = false;
let item2Holding = false;
let finalStepUnlocked = false;
let letterOpened1 = false;
let letterOpened2 = false;

// Helpers
function updateCharacterPosition() {
    character.style.left = charX + "vw";
    character.style.bottom = charY + "vh";
}

function checkCollision(rect1, rect2) {
    return !(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom);
}

// Feet hitbox (convert vh to px)
function getFeetRect(charRect, extraVH = 10) {
    const vh = window.innerHeight / 100;
    return {
        left: charRect.left,
        right: charRect.right,
        top: charRect.bottom - 5,
        bottom: charRect.bottom + extraVH * vh
    };
}

// Close letters
closeLetterBtn1.addEventListener("click", () => {
    letterBox1.style.opacity = "0";
    letterBox1.style.pointerEvents = "none";
    letterText1.style.opacity = "0";
    letterText1.style.pointerEvents = "none";
    closeLetterBtn1.style.opacity = "0";
    closeLetterBtn1.style.pointerEvents = "none";

    quest.innerText = "Quest Bonus: Deschide cadoul pe care l-au pus pisicuțele pe pat!";
    item6.style.opacity = "1";
});

closeLetterBtn2.addEventListener("click", () => {
    letterBox2.style.opacity = "0";
    letterBox2.style.pointerEvents = "none";
    letterText2.style.opacity = "0";
    letterText2.style.pointerEvents = "none";
    closeLetterBtn2.style.opacity = "0";
    closeLetterBtn2.style.pointerEvents = "none";

    quest.innerText = "Misiune completă! 🎉";
});

// Movement and pickups
document.addEventListener("keydown", e => {
    let moved = false;
    const moveStep = 0.6; // % of viewport per key press

    if (e.key === "ArrowLeft") {
        charX = Math.max(0, charX - moveStep);
        moved = true;
        document.getElementById("head").classList.add("left");
    }
    if (e.key === "ArrowRight") {
        charX = Math.min(90, charX + moveStep);
        moved = true;
        document.getElementById("head").classList.remove("left");
    }

    if (moved) {
        updateCharacterPosition();
        if (!walking) { walking = true; character.classList.add("walk"); }

        const charRect = character.getBoundingClientRect();

        // Pickup item1
        if (!holdingItem && !itemPlaced && checkCollision(charRect, item1.getBoundingClientRect())) {
            holdingItem = item1;
            canDrop = true;
            Object.assign(item1.style, { position: "absolute", width: "8vw", height: "auto", transform: "rotate(-60deg)", left: "2vw", top: "5vh", zIndex: "2", opacity: "1" });
            character.appendChild(item1);
        }

        // Pickup item2
        if (!holdingItem && !item2Holding && checkCollision(charRect, item2.getBoundingClientRect())) {
            holdingItem = item2;
            item2Holding = true;
            Object.assign(item2.style, { position: "absolute", width: "8vw", height: "auto", transform: "rotate(0deg)", left: "2vw", top: "5vh", zIndex: "2", opacity: "1" });
            character.appendChild(item2);
        }

        // Move held item
        if (holdingItem) {
            holdingItem.style.left = "2vw";
            holdingItem.style.top = "5vh";
        }

        // Drop item1
        if (holdingItem === item1 && canDrop && checkCollision(charRect, target1.getBoundingClientRect())) {
            const tRect = target1.getBoundingClientRect();
            const gRect = document.getElementById("game").getBoundingClientRect();
            const leftPct = ((tRect.left - gRect.left) / gRect.width) * 100;
            const topPct = ((tRect.top - gRect.top) / gRect.height) * 100;
            Object.assign(item1.style, { left: leftPct + "vw", top: topPct + "vh", transform: "rotate(-60deg)", zIndex: "1", position: "absolute", opacity: "1" });
            document.getElementById("game").appendChild(item1);
            holdingItem = null; canDrop = false; itemPlaced = true;
            quest.innerText = "Quest 1: Ia, pe rând, fiecare pisicuță de pe canapea și du-o pe pat, pentru un somn cât mai odihnitor! (1/2)";
        }

        // Item2 merges with item1 -> unlock letter
        if (holdingItem === item2 && itemPlaced && checkCollision(item2.getBoundingClientRect(), item1.getBoundingClientRect())) {
            item1.style.opacity = "0"; item2.style.opacity = "0";
            holdingItem = null; item2Holding = false;
            const i1Rect = item1.getBoundingClientRect();
            const gRect = document.getElementById("game").getBoundingClientRect();
            const leftPct = ((i1Rect.left - gRect.left) / gRect.width) * 100;
            const topPct = ((i1Rect.top - gRect.top) / gRect.height) * 100;
            Object.assign(item4.style, { opacity: "1", left: (leftPct - 3) + "vw", top: (topPct + 3) + "vh", transform: "rotate(35deg) scale(1)", zIndex: "1", position: "absolute" });
            Object.assign(item5.style, { opacity: "1" }); // letter appears
            finalStepUnlocked = true;
            quest.innerText = "Quest Final: Deschide scrisoarea de pe masă!";
        }
    }
});

document.addEventListener("keyup", () => {
    walking = false;
    character.classList.remove("walk");
});

// Continuous collision check for letters
function gameLoop() {
    const charRect = character.getBoundingClientRect();
    const feetRect = getFeetRect(charRect, 20); // adjust hitbox height

    // Item5 collision triggers first letter
    if (finalStepUnlocked && !letterOpened1 && checkCollision(feetRect, item5.getBoundingClientRect())) {
        letterBox1.style.zIndex = "9999";
        letterBox1.style.display = "flex";
        letterBox1.style.opacity = "1";
        letterBox1.style.pointerEvents = "auto";

        letterText1.style.opacity = "1";
        letterText1.style.pointerEvents = "auto";

        closeLetterBtn1.style.opacity = "1";
        closeLetterBtn1.style.pointerEvents = "auto";

        letterOpened1 = true;
    }

    // Item6 collision triggers second letter
    if (letterOpened1 && !letterOpened2 && checkCollision(feetRect, item6.getBoundingClientRect())) {
        letterBox2.style.zIndex = "9999";
        letterBox2.style.display = "flex";
        letterBox2.style.opacity = "1";
        letterBox2.style.pointerEvents = "auto";

        letterText2.style.opacity = "1";
        letterText2.style.pointerEvents = "auto";

        closeLetterBtn2.style.opacity = "1";
        closeLetterBtn2.style.pointerEvents = "auto";

        letterOpened2 = true;
        quest.innerText = "Surpriză finală!";
    }

    requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);

// Video autoplay
const video = document.getElementById('smallVideo');
function playVideoWithAudio() {
    video.play().catch(err => console.log("Video could not autoplay:", err));
    window.removeEventListener('click', playVideoWithAudio);
    window.removeEventListener('keydown', playVideoWithAudio);
}
window.addEventListener('click', playVideoWithAudio);
window.addEventListener('keydown', playVideoWithAudio);

