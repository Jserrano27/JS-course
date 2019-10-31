var john = {
    name: 'John',
    yearOfBirth: 1993,
    job: 'teacher',
};


// Function constructor

var Person = function (name, yearOfBirth, job) {
    this.name = name;
    this.yearOfBirth = yearOfBirth;
    this.job = job;
};

Person.prototype.calculateAge = function () {
    console.log(2019 - this.yearOfBirth);
}

Person.prototype.specie = 'Human Being';

var john = new Person('Jhon', 1993, 'Teacher');
var mark = new Person('Mark', 1978, 'Designer');
var jane = new Person('Jane', 1948, 'Retired');

john.calculateAge();
mark.calculateAge();
jane.calculateAge();

console.log(john.specie);
console.log(mark.specie);
console.log(jane.specie);

john.hasOwnProperty('job') // true

john.hasOwnProperty('lastName') // false

john instanceof Person // true

x = [1, 3, 6];

console.info(x);
x.hasOwnProperty('length') // true



// Object Create

var personProto = {
    calculateAge: function () {
        console.log(2019 - this.yearOfBirth);
    }
}

var john = Object.create(personProto);
john.name = 'John';
john.yearOfBirth = 1993;
john.job = 'teacher';


var jane = Object.create(personProto, {
    name: {
        value: 'Jane'
    },
    job: {
        value: 'Designer'
    },
    yearOfBirth: {
        value: 1999
    },
});



// Primitives vs Objects

// Primitives
a = 23;
b = a;
a = 40;
console.log(b); // 23
console.log(a); // 40

// Objects
var obj1 = {
    name: 'John',
    age: 24,
}
var obj2 = obj1;
obj1.age = 30;

console.log(obj1.age); // 30
console.log(obj2.age); // 30

// Functions
var age = 27;
var obj = {
    name: 'Mark',
    city: 'Lisbon',
}

function change(a, b) {
    a = 50;
    b.city = 'San Francisco';
}

change(age, obj);

console.log(age) // 27
console.log(obj.city) // San Francisco




//////////////////////////////////////////
//Lecture: Passing functions as arguments

var years = [1993, 1973, 2007, 1936, 1985];

var arrayCalc = function (arr, fn) {
    var array = [];
    for (var i = 0; i < arr.length; i++) {
        array.push(fn(arr[i]));
    }
    return array;
}

var calculateAge = function (year) {
    return 2019 - year;
}

var isFullAge = function (age) {
    return age >= 18;
}

var heartMaxRate = function (age) {
    if (age >= 18 && age <= 81) {
        return Math.round(206.9 - (0.67 * age));
    } else {
        return -1;
    }
}
var ages = arrayCalc(years, calculateAge);
var fullAges = arrayCalc(ages, isFullAge);
var rates = arrayCalc(ages, heartMaxRate);

console.log(ages);
console.log(fullAges);
console.log(rates);


////////////////////////
// Returning functions

var questionMaker = function (job) {
    if (job === 'teacher') {
        return function (name) {
            console.log('What subject do you teach, ' + name + '?');
        }
    } else if (job === 'designer') {
        return function (name) {
            console.log(name + ', can you tell me what UX design means?');
        }
    } else {
        return function (name) {
            console.log('Tell me ' + name + ', what is your job?');
        }
    }
}

// Create functions
var teacherQuestion = questionMaker('teacher');
var designerQuestion = questionMaker('designer');

// Call functions with name
teacherQuestion('John');
designerQuestion('Amanda');

// call questionMaker function, retrieve, and execute the return function all in once
questionMaker('architect')('Mark');


///////////////////////////////////////////////
// Inmediatly Invoked Function Expressions IIFE

// normal function declaration and function call
var game = function () {
    var score = Math.random() * 10;
    console.log(score >= 5);
}
game();


// IIFE (anonymus data, one call)

(function (goodLuck) {
    var score = Math.random() * 10;
    console.log(score >= 5 - goodLuck); // max goodLuck 5: allways win
})(5);


////////////////////////////////////7
// Closures

function retirement(retirementAge) {
    var a = ' years left for retirement';
    return function (yearOfBirth) {
        var age = 2019 - yearOfBirth;
        console.log((retirementAge - age) + a);
    }
}

var retirementUSA = retirement(67);
var retirementGermany = retirement(65);

retirementUSA(1990);
retirementGermany(1990);

retirement(66)(1990);


// Closure with job interview questions

function questionMaker(job) {
    return function (name) {
        if (job === 'teacher') {
            console.log('What subject do you teach, ' + name + '?');
        } else if (job === 'designer') {
            console.log(name + ', can you tell me what UX design means?');
        } else {
            console.log('Tell me ' + name + ', what is your job?');
        }
    }
}

var questionTeacher = questionMaker('teacher');

questionTeacher('Jane');
questionMaker('designer')('John');



////////////////////////////////////7
// Bind, Call and apply


var john = {
    name: 'John',
    age: 26,
    job: 'teacher',
    presentation: function (style, time) {
        if (style === 'formal') {
            console.log('Hi, good ' + time +
                '! My name is ' +
                this.name + '. I\'m a ' + this.job + '. I\'m ' +
                this.age + ' years old.')
        } else if (style === 'friendly') {
            console.log('What\'s up? I\'m ' + this.name + '! I\'m ' +
                this.age + ' years old and I\'m a ' + this.job + '. Have a good ' + time + '!');
        }
    }
}

//regular call
john.presentation('formal', 'afternoon');

var janice = {
    name: 'Janice',
    age: 35,
    job: 'designer',
}

// call someone else's function, passing the "this" variable as first parameter
// somemethod.call(this, [parameters])

john.presentation.call(janice, 'friendly', 'morning');

// apply works as the call method but you pass an array instead of parameters
// somemethod.apply(this, [array])

// john.presentation.apply(janice, ['param1', 'param2'])

// bind method returns a function with a predefined parameter of the original function
// var store = somemethod.bind(this, [parameters to bind]);

var johnFormal = john.presentation.bind(john, 'formal');
var janiceFriendlyMorning = john.presentation.bind(janice, 'friendly', 'morning');

johnFormal('afternoon');
janiceFriendlyMorning();

var years = [1993, 1973, 2000, 1936, 1985];

var arrayCalc = function (arr, fn) {
    var array = [];
    for (var i = 0; i < arr.length; i++) {
        array.push(fn(arr[i]));
    }
    return array;
}

var calculateAge = function (year) {
    return 2019 - year;
}

var isFullAge = function (limit, age) {
    return age >= limit;
}


var ages = arrayCalc(years, calculateAge);

// now isFullAge() expects 2 parameters, but the arrayCalc only handles one
// we'll bind one paramether and pass the only one left

var fullAgeJapan = isFullAge.bind(this, 20);

var full = arrayCalc(ages, fullAgeJapan);

// show results

console.log(ages);
console.log(full);



/////////////////////////////
// CODING CHALLENGE


/*
--- Let's build a fun quiz game in the console! ---

1. Build a function constructor called Question to describe a question. A question should include:
a) question itself
b) the answers from which the player can choose the correct one (choose an adequate data structure here, 
    array, object, etc.)
c) correct answer (I would use a number for this)

2. Create a couple of questions using the constructor

3. Store them all inside an array

4. Select one random question and log it on the console, together with the possible answers (each 
    question should have a number) (Hint: write a method for the Question objects for this task).

5. Use the 'prompt' function to ask the user for the correct answer. The user should input the 
number of the correct answer such as you displayed it on Task 4.

6. Check if the answer is correct and print to the console whether the answer is correct ot nor 
(Hint: write another method for this).

7. Suppose this code would be a plugin for other programmers to use in their code. So make sure 
that all your code is private and doesn't interfere with the other programmers code (Hint: we 
    learned a special technique to do exactly that).
*/



(function () {

    function Question(question, options, correct) {
        this.question = question;
        this.options = options;
        this.correct = correct;
    }

    var q1 = new Question('Summer or Winter?', ['Summer', 'Winter'], 0);

    var q2 = new Question('Where is Pinheira located?', ['Palhoça', 'Paulo Lopes', 'Florianópolis'], 0);

    var q3 = new Question('What\'s the correct order for a perfect sandwich (from top to bottom)?', [
        'Ham - Requeijao - Cheese',
        'Cheese - Requeijao - Ham',
        'Cheese - Requeijao - Ham'
    ], 2);

    var questions = [q1, q2, q3];

    var n = Math.floor(Math.random() * questions.length);

    Question.prototype.askQuestion = function () {
        console.log(this.question);
        for (var i = 0; i < this.options.length; i++) {
            console.log(i + ': ' + this.options[i]);
        }
    }

    Question.prototype.checkAnswer = function (answer) {
        console.log('.................')
        if (answer === this.correct) {
            console.log('That\'s Correct!');
        } else {
            console.log('Wrong Answer :(');
        }
    }

    questions[n].askQuestion();

    var answer = parseInt(prompt('Welcome to the fun game! Answer with the correct number'));

    questions[n].checkAnswer(answer);
})();


/*-- - Expert level-- -

8. After you display the result, display the next random question, so that the game never ends(Hint: write a
    function
    for this and call it right after displaying the result)

9. Be careful: after Task 8, the game literally never ends.So include the option to quit the game
if the user writes 'exit'
instead of the answer.In this
case, DON 'T call the function from task 8.

10. Track the user 's score to make the game more fun! So each time an answer is correct, add 1 point to the score (Hint: I'
m going to use the power of closures
for this, but you don 't have to, just do this with the tools you feel more comfortable at this point).

11. Display the score in the console.Use yet another method
for this.
*/


(function () {

    function Question(question, options, correct) {
        this.question = question;
        this.options = options;
        this.correct = correct;
    }

    var q1 = new Question('Summer or Winter?', ['Summer', 'Winter'], 0);

    var q2 = new Question('Where is Pinheira located?', ['Palhoça', 'Paulo Lopes', 'Florianópolis'], 0);

    var q3 = new Question('What\'s the correct order for a perfect sandwich (from top to bottom)?', [
        'Ham - Requeijao - Cheese',
        'Cheese - Requeijao - Ham',
        'Cheese - Requeijao - Ham'
    ], 2);

    var questions = [q1, q2, q3];

    var n, answer, score = 0;

    Question.prototype.askQuestion = function () {
        console.log(this.question);
        for (var i = 0; i < this.options.length; i++) {
            console.log(i + ': ' + this.options[i]);
        }
    }

    Question.prototype.displayScore = function () {
        console.log('Your current score is: ' + score);
    }

    Question.prototype.nextQuestion = function () {
        n = Math.floor(Math.random() * questions.length);

        questions[n].askQuestion();

        answer = prompt('Welcome to the fun game! Answer with the correct number or type "exit"');

        questions[n].checkAnswer(answer);
    }

    Question.prototype.checkAnswer = function (answer) {
        if (answer !== 'exit') {
            if (parseInt(answer) === this.correct) {
                score++;
                console.log('That\'s Correct!');
            } else {
                console.log('Wrong Answer. Try again!');
            }
            this.displayScore();
            console.log('-----------------------------')
            this.nextQuestion();
        }
    }

    Question.prototype.nextQuestion();

})();