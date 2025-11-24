document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector(".container .gabriel .head img");
    const button = document.querySelector(".button");
    const button2 = document.querySelector(".button2"); // second button
    const input = document.querySelector("input");
    const promptDivs = document.querySelectorAll(".prompt");
    const captchaLabel = document.querySelector(".captcha-label"); // reCAPTCHA label
    const firstPrompt = promptDivs[0]; // "Dovedește că mă iubești..."

    const defaultFace = "src/images/default.png";
    const thinkingFace = "src/images/thinking.png";
    const happyFace = "src/images/happy.png";
    const checkmarkImg = "src/images/check.png";
    const xmarkImg = "src/images/x.png";

    // Hide second button initially
    button2.style.display = "none";

    // Feedback icon
    let feedbackIcon = document.createElement("img");
    feedbackIcon.classList.add("feedback-icon");
    button.parentNode.appendChild(feedbackIcon);

    // Questions
    const questions = [
        { question: "Unde ne-am cunoscut?", answers: ["dating", "facebook"] },
        { question: "Când ți-am zis prima dată TE IUBESC?", answers: ["nastere", "ziua mea", "capac", "cutie", "scris"] },
        { question: "Câte piruete am făcut când ne-am văzut prima dată?", answers: ["2", "doua"] },
        { question: "Ce iubim noi cel mai mult?", answers: ["zapada", "pisica", "pisicile", "frigul", "muntele", "aventura", "vacantele", "calatoriile"] }
    ];
    let currentQuestion = 0;

    // Set initial question
    promptDivs[1].textContent = questions[currentQuestion].question;

    const animateStart = () => {
        container.classList.add("told-gabriel");

        const userAnswer = input.value.toLowerCase().trim();
        if (questions[currentQuestion].answers.some(ans => userAnswer.includes(ans))) {
            button.style.backgroundColor = "green";
            feedbackIcon.src = checkmarkImg;
            feedbackIcon.style.display = "inline";

            // Move to next question after short delay
            setTimeout(() => {
                currentQuestion++;
                if (currentQuestion < questions.length) {
                    promptDivs[1].textContent = questions[currentQuestion].question;
                    input.value = "";
                    button.style.backgroundColor = "";
                    feedbackIcon.style.display = "none";
                    container.src = defaultFace;
                } else {
                    // All questions answered correctly
                    promptDivs[1].textContent = "Ai răspuns corect la toate întrebările! Dar aventura acum începe! Trebuie să faci rost de cadoul suprem!";
                    input.style.display = "none";
                    button.style.display = "none";
                    feedbackIcon.style.display = "none";
                    container.src = happyFace;

                    // Hide first prompt and reCAPTCHA
                    firstPrompt.style.display = "none";
                    if (captchaLabel) captchaLabel.style.display = "none";

                    // Show the second button
                    button2.style.display = "inline-block";
                    button2.textContent = "Caută-l acum!";

                    button2.addEventListener("click", () => {
                    window.location.href = "game.html";
                    });
                }
            }, 800);
        } else {
            // Wrong answer
            button.style.backgroundColor = "red";
            feedbackIcon.src = xmarkImg;
            feedbackIcon.style.display = "inline";
            input.value = "";
            container.src = defaultFace;
        }
    };

    const inputChangeHandler = (event) => {
        const value = event.target.value.toLowerCase().trim();

        if (value.length > 0) {
            container.src = thinkingFace;
        } else {
            container.src = defaultFace;
        }

        // Turn happy if typing correct answer
        if (questions[currentQuestion].answers.some(ans => value.includes(ans))) {
            container.src = happyFace;
        }

        // Reset button and feedback icon on input change
        button.style.backgroundColor = "";
        feedbackIcon.style.display = "none";
    };

    button.addEventListener("click", animateStart);
    input.addEventListener("input", inputChangeHandler);


    // Video autoplay
    const video2 = document.getElementById('smallVideo2');
    function playVideoWithAudio() {
        video2.play().catch(err => console.log("Video could not autoplay:", err));
        window.removeEventListener('click', playVideoWithAudio);
        window.removeEventListener('keydown', playVideoWithAudio);
    }
    window.addEventListener('click', playVideoWithAudio);
    window.addEventListener('keydown', playVideoWithAudio);


});

