let intro_section     = document.querySelector(".intro");
let langs_btns        = document.querySelectorAll(".choose_lang");
let quiz_section      = document.querySelector(".quiz");
let category          = document.querySelector(".category");
let current_question  = document.querySelector(".current_question");
let all_questions     = document.querySelector(".all_questions");
let question_title    = document.querySelector(".title");
let options           = document.querySelectorAll(".answer label");
let submit_btn        = document.querySelector(".submit");
let result_section    = document.querySelector(".result");
let result_head       = document.querySelector(".result_head");
let result_text       = document.querySelector(".result_text");
let percent           = document.querySelector(".percent");
let play_again        = document.querySelector(".play_again");

//this is to show the correct answered questions
let solution = 0;
//this count will be use to select wich language for quiz
let count = "";
//this number will be use to change the questions
let question_number = 0;

langs_btns.forEach( btn => btn.addEventListener("click", ()=> {

    //on choose a language hide the buttons and shwo the content
    intro_section.classList.add("hide")
    quiz_section.classList.remove("hide")

    //change the count value depending on the selected language
    if(btn.getAttribute("data-content") == "html") {
        count = 0
    }
    if(btn.getAttribute("data-content") == "css") {
        count = 1
    }
    if(btn.getAttribute("data-content") == "javascript") {
        count = 2
    }
    //fetch the data from the json file
    fetch("questions.json")
        .then(response => response.json())
        .then((data) => {
            set_data(data)
            next_question(data)
        })
}))
function set_data (data) {
        category.innerHTML         = data[count].category.toUpperCase();
        current_question.innerHTML = question_number + 1;
        all_questions.innerHTML    = data[count].content.length;
        question_title.innerHTML   = data[count].content[question_number].title
                                                                        .split(" ")
                                                                        .map( el => el.includes("&lt") || el.includes("{") || el.includes("(") ? `<span class="code"><code> ${el}</code></span>` : el)
                                                                        .join(" "); // the split function will be use to change the background of tag or property


        // this loop is for to show the options in the label
        for(let i = 0; i < options.length; i++) {
            
            options[i].innerHTML = data[count].content[question_number][`answer_${i + 1}`];
            
            options[i].addEventListener("click", ()=> {
                remove_option_color()
                options[i].classList.add("choosen")
            })
        }
        
}

//function to go the next question and remove the style from the choosen option
function next_question (data) {
    submit_btn.addEventListener("click", ()=> {

        remove_option_color()

        check_answer(data)
        options[0].classList.add("choosen")
        options[0].previousElementSibling.checked = true

        if(question_number + 1 >= data[count].content.length) {
            remove_option_color()
            remove_radio_check()
            submit_btn.classList.add("disabled")
            result_section.classList.remove("hide")
            if(solution == 0) {
                result_head.innerHTML = "very bad";
                percent.innerHTML     = 0;
            }
            return false;
        } else {
            question_number++
        }

        set_data(data)

    })
}
//function the check if the choosen answer and the right answer are equal
function check_answer(data) {
    let right = data[count].content[question_number].right_answer
    for(let i = 0; i < options.length; i++) {
        if(options[i].previousElementSibling.checked) {
            if(right == options[i].innerHTML) {
                solution++
                let solution_in_percent = Math.floor(solution * 100 / data[count].content.length)
                if(solution < 2) {
                    result_text.innerHTML = `You answerd <span>${solution}</span> question correctly from <span>${data[count].content.length}</span>`;
                } else {
                    result_text.innerHTML = `You answerd ${solution} questions correctly ${data[count].content.length}`;
                }
                percent.innerHTML = solution_in_percent;

                if(solution_in_percent >= 80) {
                    result_head.innerHTML = "congratulations";
                }
                if(solution_in_percent < 80 && solution_in_percent >= 50) {
                    result_head.innerHTML = "good";
                }
                if(solution_in_percent < 50 && solution_in_percent >= 25) {
                    result_head.innerHTML = "not bad";

                }
                if(solution_in_percent <= 25 ) {
                    result_head.innerHTML = "very bad";
                }
            }

        }
    }
}

//function to remove the color from all label when choose another one
function remove_option_color() {
    options.forEach(el => el.classList.remove("choosen"))
}
function remove_radio_check() {
    options.forEach(el => el.previousElementSibling.checked = false)
}
play_again.addEventListener("click", ()=> {
    location.reload()
})