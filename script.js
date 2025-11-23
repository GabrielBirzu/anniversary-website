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
const item5 = document.getElementById("item5");
const item6 = document.getElementById("item6");
const quest = document.getElementById("quest");

const letterBox1 = document.getElementById("letterBox");
const closeLetterBtn1 = document.getElementById("closeLetterBtn");
const letterBox2 = document.getElementById("letterBox2");
const closeLetterBtn2 = document.getElementById("closeLetterBtn2");

// Initial states
item4.style.opacity = "0";
item5.style.opacity = "0";
item5.style.pointerEvents = "none";
item6.style.opacity = "0";
item6.style.pointerEvents = "none";

let x = 300, y = 805; // fixed bottom
character.style.left = x + "px";
character.style.top = y + "px";

let walking = false;
let holdingItem = null;
let canDrop = true;
let itemPlaced = false;
let item2Holding = false;

let finalStepUnlocked = false;
let letterOpened1 = false;
let letterOpened2 = false;

// Collision check
function checkCollision(rect1, rect2) {
    return !(rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom);
}

// Feet hitbox for bottom items
function getFeetRect(charRect, height = 150) {
    return {
        left: charRect.left,
        right: charRect.right,
        top: charRect.bottom - 10,
        bottom: charRect.bottom + height
    };
}

// Close buttons
closeLetterBtn1.addEventListener("click", () => {
    letterBox1.style.display = "none";
    // Show gift only after closing letter 1
    quest.innerText = "Quest Bonus: Deschide cadoul pe care l-au pus pisicuțele pe pat!";
    item6.style.opacity = "1";
    item6.style.pointerEvents = "auto";
});

closeLetterBtn2.addEventListener("click", () => {
    letterBox2.style.display = "none";
    quest.innerText = "Misiune completă! 🎉";
});

// Key events
document.addEventListener("keydown", e => {
    let moved = false;



    // Check for letter1 collision
    if (finalStepUnlocked && !letterOpened1) {
        const charRect = character.getBoundingClientRect();
        const item5Rect = item5.getBoundingClientRect();
        const feetRect = getFeetRect(charRect, 300);

        if (checkCollision(feetRect, item5Rect)) {
            letterBox1.style.display = "flex";
            letterOpened1 = true;
        }
    }

    // Check for letter2 collision (gift)
    if (letterOpened1 && !letterOpened2) {
        const charRect = character.getBoundingClientRect();
        const item6Rect = item6.getBoundingClientRect();
        const feetRect = getFeetRect(charRect, 300);

        if (checkCollision(feetRect, item6Rect)) {
            letterBox2.style.display = "flex";
            letterOpened2 = true;
            quest.innerText = "Surpriză finală!";
        }
    }

    if (e.key === "ArrowLeft") {
        x -= 10;
        moved = true;
        document.getElementById("head").classList.add("left"); // flip head left
    }
    if (e.key === "ArrowRight") {
        x += 10;
        moved = true;
        document.getElementById("head").classList.remove("left"); // normal head
    }


    if (moved) {
        character.style.left = x + "px";
        character.style.top = y + "px";

        if (!walking) {
            walking = true;
            character.classList.add("walk");
        }

        const charRect = character.getBoundingClientRect();

        // ---------- PICKUP ITEM 1 ----------
        if (!holdingItem && !itemPlaced) {
            const item1Rect = item1.getBoundingClientRect();
            if (checkCollision(charRect, item1Rect)) {
                holdingItem = item1;
                canDrop = true;

                Object.assign(item1.style, {
                    position: "absolute",
                    width: "250px",
                    height: "250px",
                    rotate: "-60deg",
                    left: "20px",
                    top: "100px",
                    zIndex: "1",
                    opacity: "1"
                });

                character.appendChild(item1);
            }
        }

        // ---------- PICKUP ITEM 2 ----------
        if (!holdingItem && !item2Holding) {
            const item2Rect = item2.getBoundingClientRect();
            if (checkCollision(charRect, item2Rect)) {
                holdingItem = item2;
                item2Holding = true;

                Object.assign(item2.style, {
                    position: "absolute",
                    width: "250px",
                    height: "250px",
                    rotate: "0deg",
                    left: "20px",
                    top: "100px",
                    zIndex: "1",
                    opacity: "1"
                });

                character.appendChild(item2);
            }
        }

        // ---------- MOVE HELD ITEM ----------
        if (holdingItem) {
            holdingItem.style.left = "20px";
            holdingItem.style.top = "100px";

            // Drop Item 1
            if (holdingItem === item1 && canDrop) {
                const targetRect = target1.getBoundingClientRect();
                if (checkCollision(charRect, targetRect)) {
                    Object.assign(item1.style, {
                        left: targetRect.left - 40 + "px",
                        top: targetRect.top - 80 + "px",
                        rotate: "-60deg",
                        zIndex: "-1",
                        opacity: "1"
                    });
                    document.getElementById("game").appendChild(item1);

                    holdingItem = null;
                    canDrop = false;
                    itemPlaced = true;
                }
            }

            // Item 2 touches dropped Item 1
            if (holdingItem === item2 && itemPlaced) {
                const droppedRect = item1.getBoundingClientRect();
                const item2Rect = item2.getBoundingClientRect();
                if (checkCollision(item2Rect, droppedRect)) {
                    item1.style.opacity = "0";
                    item2.style.opacity = "0";
                    holdingItem = null;
                    item2Holding = false;

                    Object.assign(item4.style, {
                        opacity: "1",
                        position: "absolute",
                        left: droppedRect.left - 240 + "px",
                        top: droppedRect.top - 120 + "px",
                        rotate: "35deg",
                        zIndex: "-1"
                    });

                    Object.assign(item5.style, {
                        opacity: "1",
                        pointerEvents: "auto"
                    });

                    finalStepUnlocked = true;
                    quest.innerText = "Quest Final: Deschide scrisoarea de pe masă!";
                }
            }
        }
    }
});

document.addEventListener("keyup", () => {
    walking = false;
    character.classList.remove("walk");
});

// ---------- VIDEO AUTOPLAY ----------
const video = document.getElementById('smallVideo');
function playVideoWithAudio() {
    video.play().catch(err => console.log("Video could not autoplay:", err));
    window.removeEventListener('click', playVideoWithAudio);
    window.removeEventListener('keydown', playVideoWithAudio);
}
window.addEventListener('click', playVideoWithAudio);
window.addEventListener('keydown', playVideoWithAudio);
