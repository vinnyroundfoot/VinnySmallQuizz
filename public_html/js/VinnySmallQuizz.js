 (function (alias) {
     // begin SmallJ
    var SmallJ = {
        /* function ready
         * Equivalent of jQuery.ready function
         * fn : function to be called when document is ready
         */
        ready : function (fn) {
            if (document.readyState !== 'loading') {
                fn();
            }else{
                document.addEventListener('DOMContentLoaded', fn);
            }
        },
        
        /* function getElement
         * return DOM element depending on selector
         * selector : Dom Selector
         * return : DOM Node
         */
        getElement : function(selector) {
            return document.querySelector(selector);
        },
        
        /* function getElements
         * return : Array of DOM elements depending on selector
         * selector : Dom Selector
         * return : Dom Array
         */
        getElements : function(selector) {
            return document.querySelectorAll(selector);
        },
        
        /* function createElement
         * create a DOM element as child of "elem" based on "options" parameters
         * elem : DOM element parent of the added element
         * options : options object used to customize the added Dom Element
         *  - id : ID of element
         *  - text : String to add to the element
         *  - type : type of DOM Element
         */
        createElement : function(elem, options) {
            var newElem = document.createElement(elem);
            if (options){
                if (options.text) {
                    //var nodeText = document.createTextNode(options.text);
                    //newElem.appendChild(nodeText);
                    newElem.innerHTML = options.text;
                };
                
                if (options.src) {
                    newElem.src = options.src;
                }

                if (options.id) {
                    newElem.id = options.id;
                };

                if (options.type) {
                    newElem.type = options.type;
                };

                if (options.name) {
                    newElem.name = options.name;
                };

                if (options.value !== 'undefined') {
                    newElem.value = options.value;
                };
                
                if (options.checked) {
                    newElem.checked = options.checked;
                };

                if (options.classes && options.classes.length>0 ){
                    for (var c in options.classes) {
                        if (options.classes[c]!==undefined) newElem.classList.add (options.classes[c]);
                    };
                };
                
                if (options.parentElem) {
                    options.parentElem.appendChild(newElem);   
                };
            }

            return newElem;
        },
        /* function removeElment
         * Remove specified element from the DOM
         * elem : Node Element
         */
        removeElement : function(elem) {
            if (elem){
                var par = elem.parentElement;
                par.removeChild(elem);
                return par;
            }
        },
        
        /* function emptyElement
         * remove content of the specified element
         * elem : Node Element
         */
        emptyElement : function(elem) {
            if (elem) { elem.innerHTML =''; };
        },
        
        /* function hideElement
         * Hide specified Element
         * elem : node Element
         */
        hideElement : function(elem) {
            if (elem) { elem.style.display = 'none'; };
        },
        
        /* function showElement
         * show the specified elemennt
         * elem : node Element
         */
        showElement : function(elem) {
            if (elem) { elem.style.display = '' ;};
        },
        
        /* function toggleElement
         * display or hide the specified element
         * elem : node Element
         */
        toggleElement : function(elem) {
            if (!elem.style.display || elem.style.display !== 'none') {
                elem.style.display = 'none';
                
            }else{
                elem.style = '';
            }
        }
    }; //end SmallJ 
    
    
    // BASE LINE INITIALISATION
    // ------------------------
    var Quizz = {},
        root = this,
        alias1;
        
    Quizz.VERSION = '0.1';
    Quizz.AUTHOR = 'VinnyRoundfoot';
    Quizz.elClass = {
        
        'ul'      : 'quizz-ul-class',
        'li'      : 'quizz-li-class',
        'input'   : 'quizz-option-class',
        'question': 'quizz-question-class',
        'rem'     : 'quizz-rem-class'
    };
    Quizz.SmallJ = SmallJ;
    Quizz.config = {};

    // default ID for items & default parameters    
    Quizz.defaultParams = {
        'question_box'      : '#question',
        'message_box'       : '#message',
        'previous_control'  : '#previousQuestion',
        'next_control'      : '#nextQuestion',
        'default_value'     : false,
        'empty_answer_warning' : 'Please make a choice'
    };    
     
    // will hold the current displayed question     
    Quizz.currentQuestion =  {};
     
     
    // CORE FUNCTIONS
    // --------------

    // get the choice made by user    
    Quizz.choose =  function () {
        var el = SmallJ.getElement('input[name="reponse"]:checked');
        if (el) {
            var choice = el.value;
            if (!isNaN(choice)) {
                Quizz.currentQuestion.choice = choice;
            }
            return choice;
            }
     };
    
    //create HTML radio List based on referenced question
    Quizz.BuildQuestionUI = function(question) {
        var radioList = SmallJ.createElement('ul', {'classes' : [Quizz.elClass.ul]});
        var item;
        var input = '';
        var span;
        var choices = question.options;
        // check the previously answer made or get the default answer option if any
        var activeChoice = (question.choice ? question.choice : (parseInt(question.defaultChoice)!==NaN ? question.defaultChoice : (Quizz.config.default_value ? 0 : -1)));
        
        //loop through all possibles anwser and create the radiolist
        for (var i = 0; i < choices.length; i++) {
            item = SmallJ.createElement('li', {'parentElem' : radioList, classes: [Quizz.elClass.li]});
            input = SmallJ.createElement('input', {parentElem: item, type:'radio', name:'reponse', value: i, checked : (parseInt(activeChoice) === i), classes : [Quizz.elClass.input]});
            if (choices[i].lib) {
                span = SmallJ.createElement('span', {parentElem : item, classes:  [choices[i].lib_css_class] , text: choices[i].lib});
            }else{
                if (choices[i].image) {
                    span = SmallJ.createElement('img', {parentElem : item, src : choices[i].image, classes:  [choices[i].image_css_class]});
                }
            }    
        }
        return radioList;
    };
    
    
    // clear quizz UI
    Quizz.clearUI = function () {
        SmallJ.removeElement(SmallJ.getElement(Quizz.config.rem_box));
        SmallJ.emptyElement(SmallJ.getElement(Quizz.config.question_box));
        SmallJ.removeElement(SmallJ.getElement(Quizz.config.next_control));
        SmallJ.removeElement(SmallJ.getElement(Quizz.config.previous_control));
    };
    
    //find question base on its ID
    Quizz.findQuestion = function(idQuestion) {
      return Quizz.questions.filter(function(q){return q.id === idQuestion;})[0];
    };
    
    // set the "originator" of the referenced question 
    Quizz.setQuestionOrigine = function(question){
      
      // don't set the origin if we go back on the question list
      // only set it when user move forward on the question list
      if (question.id < Quizz.currentQuestion.id) {
          return;
      }  
        
      if ((Quizz.currentQuestion) && (question) ) {
         question.origine = Quizz.currentQuestion.id;
      }  
      
      if (!question ) {
          question = Quizz.currentQuestion;
      }        
    };
    
    //build the question based on the question ID
    Quizz.createQuestion = function(idQuestion) {
      // find the question based on its ID
      var question = Quizz.findQuestion(idQuestion);
       // get the "handle" of the question container and remove child elements
       
      // hide previously displayed message
      SmallJ.hideElement(SmallJ.getElement(Quizz.config.message_box));
      
      var $c = SmallJ.getElement(Quizz.config.question_box);
      SmallJ.emptyElement($c);
      
      // display question immage
      if (question.image) {
          SmallJ.createElement('img', {parentElem : $c, src : question.image, classes : [question.image_css_class]});
      }
      
      //display question lib
      if (question.lib) {
          SmallJ.createElement('p', {parentElem : $c, text : 'Question : ' + question.lib, classes : [Quizz.elClass['question'],  question.lib_css_class]});
      }
      
      //build the radio list option (ul)
      $p = SmallJ.createElement('p');
      $p.appendChild(Quizz.BuildQuestionUI(question));
      $c.appendChild($p);

      //display question comments if any
      if (question.comment){
        if (!Quizz.config.rem_box) {
            SmallJ.createElement('p', {parentElem : $c, text: question.comment, classes : ['quizz-rem-class']});
        }else{
            SmallJ.getElement(Quizz.config.rem_box).innerHtml = question.comment;
        }
      }else{
          //hide previous displayed comments if needed
          if(Quizz.config.rem_box) {
              SmallJ.emptyElement(SmallJ.getElement(Quizz.config.rem_box));
          }
      }


      //Set the originator of the current question
      Quizz.setQuestionOrigine(question);
      
      //Set the currentQuestion reference
      Quizz.currentQuestion = question;      
      
      return question;
    };

    Quizz.start = function (questions, elClass ) {
      Quizz.questions = questions;  
      
      if (elClass) {
        Quizz.elClass = elClass;
     }
      
      
      var question = Quizz.createQuestion(1);
      question.origine = 0;
      return question;
    };

    // INIT FUNCTION
    // ------------- 
     Quizz.init = function(questionsList, user_params) { //begin of Quizz init 
         
        // if any, check custom config and overrides the default configuration
        if(user_params) {
            Quizz.config['question_box']        = (user_params['question_box'] || Quizz.defaultParams['question_box'] );
            Quizz.config['message_box']         = (user_params['message_box'] || Quizz.defaultParams['message_box'] );
            Quizz.config['rem_box']             = (user_params['rem_box'] || Quizz.defaultParams['rem_box'] );
            Quizz.config['previous_control']    = (user_params['previous_control'] || Quizz.defaultParams['previous_control'] );
            Quizz.config['next_control']        = (user_params['next_control'] || Quizz.defaultParams['next_control'] );
            Quizz.config['default_value']       = (user_params['default_value'] || Quizz.defaultParams['default_value'] );
            Quizz.config['empty_answer_warning']= (user_params['empty_answer_warning'] || Quizz.defaultParams['empty_answer_warning'] );
        }else{
            Quizz.config = Quizz.defaultParams;
            console.log('#Quizz info# : user_params not specified. default control id used : #Question, #message, #previousControl, #nextControl');
        }    
        
        if (!questionsList) {
            console.log('#Quizz Error# : Questions not specified. Unable to init Quizz')
        }
       
        // On Document Ready
        // create the quizz and add event listeners
        SmallJ.ready(function() //begin of SmallJ.ready
        {
            var displayMessage = function(message, ctl ){
                if (!ctl ||typeof ctl === 'string') {
                    $message = SmallJ.getElement(Quizz.config.message_box);
                }else{
                    $message = ctl;
                }

                if ($message) {
                    $message.innerHTML = message;
                    SmallJ.showElement($message);
                }else{
                    alert(message);
                }            
            };

           Quizz.start(questionsList);

           // add "click" event on defined "previous" button
           var prevBut = SmallJ.getElement(Quizz.config['previous_control']);
           prevBut.addEventListener("click", function(e) {
             // "previous" button just go back to the first question before current question
             // the question ID of the previous question  is defined by currentQuestion.origine
             if (Quizz.currentQuestion.origine) {
                 Quizz.createQuestion(Quizz.currentQuestion.origine);  
             }else{
                // If no previous question
                // we go back to the first question
                 Quizz.createQuestion(1); 
             } 
           });

           // add "click" event on defined "next" button
           var nextBut = SmallJ.getElement(Quizz.config['next_control']);
           nextBut.addEventListener("click", function(e) {
             // hide 'message_box' element is it was displayed for the current question  
             SmallJ.hideElement(SmallJ.getElement(Quizz.config['message_box']));
             
             //get the user choice for the current question displayed
             var choice = Quizz.choose();
             if (!isNaN(choice)) {
                 // get the destination for the user's choice
                var destination = Quizz.currentQuestion.options[choice].destination;
                
                // determine what to do depending on the possible choice structure
                if (!Quizz.currentQuestion.options[choice].destination || Quizz.currentQuestion.options[choice].wrong_message) {
                    // destination not defined and a "wrong_message" exists, then the choice made by user is wrong
                    destination = 0;
                }
                if (Quizz.currentQuestion.options[choice].end_message){
                    //end_message is defined. We assume that it is the end of the quizz
                    destination = 1000;
                };
                if (Quizz.currentQuestion.options[choice].url){
                    //url is defined. Then, we have to redirect to another URL
                    destination = 2000;
                };
                if (Quizz.currentQuestion.options[choice].callback_function){
                    // a callback function is defined. we have to call it
                    destination = 3000;
                }
 
                switch(destination) {
                    case 0 : 
                        // display the "wrong message" and stay on the current question
                        var wrong = Quizz.currentQuestion.options[choice].wrong_message;
                        displayMessage(wrong);
                        break;
                    case 1000 : 
                        // quizz is over.
                        // display the end message and clear the quizz 
                        var end_message = Quizz.currentQuestion.options[choice].end_message;
                        displayMessage(end_message);
                        Quizz.clearUI();
                        break;
                    case 2000 :
                        // move to another url
                        var url = Quizz.currentQuestion.options[choice].url;
                        window.location = url; 
                        break;
                    case 3000:
                        //call the callback function 
                        Quizz.currentQuestion.options[choice].callback_function();
                        break;
                    default :     
                        //move to the question defined by "destination"
                        Quizz.createQuestion(destination);                       
                }
             }else{
                 // if no choice made, display message defined in "empty_answer_warning"
                 displayMessage(Quizz.config.empty_answer_warning);
             }
           });        
        }); // end of SmallJ.ready
    }; // end of Quizz.init

    // RETURN QUIZZ OBJECT
    // -------------------
    if (typeof alias === "string" && alias.length > 0) {
        alias1 = alias;
    } else {
        alias1 = 'VinnySmallQuizz';
    }

    var finalQuizz = {
        SmallJ : SmallJ,
        currentQuestion : Quizz.currentQuestion,
        createQuestion : Quizz.createQuestion,
        init : Quizz.init
    };

    //code récupéré de underscore.js
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = finalQuizz;
        }
        exports[alias1] = finalQuizz;
    } else {
        root[alias1] = finalQuizz;
    }    

})();
