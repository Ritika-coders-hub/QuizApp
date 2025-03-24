
document.addEventListener("DOMContentLoaded", () => {
    loadCategoryQuizzes();
    showLeaderboard();
});

function addQuestion() {
    let container = document.getElementById("questions-container");
    let div = document.createElement("div");
    div.innerHTML = `
        <input type="text" class="question" placeholder="Enter Question">
        <input type="text" class="option" placeholder="Option 1">
        <input type="text" class="option" placeholder="Option 2">
        <input type="text" class="option" placeholder="Option 3">
        <input type="text" class="option correct-answer" placeholder="Correct Answer">
    `;
    container.appendChild(div);
}

function saveQuiz() {
    let title = document.getElementById("quiz-title").value;
    let category = document.getElementById("quiz-category").value;
    let questions = [];

    document.querySelectorAll("#questions-container div").forEach(q => {
        let options = q.querySelectorAll(".option");
        questions.push({
            question: q.querySelector(".question").value,
            options: [options[0].value, options[1].value, options[2].value],
            correctAnswer: options[3].value
        });
    });

    let quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
    let deletedQuizzes = JSON.parse(localStorage.getItem("deletedQuizzes")) || [];

    // Check if quiz exists in deletedQuizzes and restore it
    let restoredQuiz = deletedQuizzes.find(q => q.title === title && q.category === category);
    if (restoredQuiz) {
        quizzes.push(restoredQuiz);
        localStorage.setItem("quizzes", JSON.stringify(quizzes));

        // Remove from deleted quizzes
        deletedQuizzes = deletedQuizzes.filter(q => !(q.title === title && q.category === category));
        localStorage.setItem("deletedQuizzes", JSON.stringify(deletedQuizzes));

        alert("Quiz restored!");
    } else {
        quizzes.push({ title, category, questions });
        localStorage.setItem("quizzes", JSON.stringify(quizzes));
        alert("Quiz saved!");
    }

    loadCategoryQuizzes();
}
function deleteQuiz(title, category) {
    let quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
    let deletedQuizzes = JSON.parse(localStorage.getItem("deletedQuizzes")) || [];

    // Find the quiz to delete
    let quizToDelete = quizzes.find(q => q.title === title && q.category === category);
    
    if (quizToDelete) {
        deletedQuizzes.push(quizToDelete); // Store in deleted list
    }

    // Remove the quiz from active quizzes
    quizzes = quizzes.filter(q => !(q.title === title && q.category === category));

    // Save updates to localStorage
    localStorage.setItem("quizzes", JSON.stringify(quizzes));
    localStorage.setItem("deletedQuizzes", JSON.stringify(deletedQuizzes));

    alert("Quiz deleted! You can restore it later.");
    loadCategoryQuizzes();
    loadDeletedQuizzes(); // Refresh the deleted quiz list
}



function loadCategoryQuizzes() {
    let category = document.getElementById("category-select").value;
    let quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
    let filteredQuizzes = quizzes.filter(q => q.category === category);

    let quizList = document.getElementById("quiz-list");
    quizList.innerHTML = "";

    filteredQuizzes.forEach((quiz) => {
        let button = document.createElement("button");
        button.innerText = quiz.title;
        button.onclick = () => startQuiz(quiz);
        quizList.appendChild(button);
    });
}

let timer;
function startQuiz(quiz) {
    document.getElementById("quiz-attempt").style.display = "block";
    document.getElementById("quiz-title-display").innerText = quiz.title;

    let questionsContainer = document.getElementById("quiz-questions");
    questionsContainer.innerHTML = "";

    quiz.questions.forEach((q, index) => {
        let questionDiv = document.createElement("div");
        questionDiv.innerHTML = `
            <p>${q.question}</p>
            ${q.options.map(opt => `<input type="radio" name="q${index}" value="${opt}"> ${opt}<br>`).join("")}
        `;
        questionsContainer.appendChild(questionDiv);
    });

    let timeLeft = 60;
    timer = setInterval(() => {
        document.getElementById("timer").innerText = `Time Left: ${timeLeft} sec`;
        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(timer);
            submitQuiz();
        }
    }, 1000);
}

function submitQuiz() {
    clearInterval(timer);
    alert("Quiz submitted!");
}
function clearAllQuizzes() {
    if (confirm("Are you sure you want to delete all quizzes?")) {
        localStorage.removeItem("quizzes");
        alert("All quizzes deleted!");
        loadCategoryQuizzes();
    }
}


function showLeaderboard() {
    document.getElementById("leaderboard-list").innerHTML = "<p>No leaderboard yet.</p>";
}
