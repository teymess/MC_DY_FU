/**
* # Player type implementation of the game stages
* Copyright(c) 2021 Anca <anca.balietti@gmail.com>
* MIT Licensed
*
* Each client type must extend / implement the stages defined in `game.stages`.
* Upon connection each client is assigned a client type and it is automatically
* setup with it.
*
* http://www.nodegame.org
* ---
*/


"use strict";

const ngc = require('nodegame-client');
const J = ngc.JSUS;

//var req = false;

module.exports = function(treatmentName, settings, stager, setup, gameRoom) {

    // Make the player step through the steps without waiting for other players.
    stager.setDefaultStepRule(ngc.stepRules.SOLO);

    stager.setOnInit(function() {

        // Initialize the client.

        var header;

        // Setup page: header + frame.
        header = W.generateHeader();
        W.generateFrame();

        //node.widgets.add('Goto', document.body, { docked: true });

        // Add widgets.
        this.visualStage = node.widgets.append('VisualStage', header, {
            next: false
        });

        //this.visualRound = node.widgets.append('VisualRound', header, {
        // displayMode: [
        // 'COUNT_UP_STAGES_TO_TOTAL',
        //'COUNT_UP_STEPS_TO_TOTAL'
        //  ]
        //});

        this.doneButton = node.widgets.append('DoneButton', header, {
            text: 'Next'
        });

        this.discBox = node.widgets.append('DisconnectBox', header, {
            disconnectCb: function() {
                W.init({
                    waitScreen: true
                });
                node.game.pause('Disconnection detected. Please refresh ' +
                'to reconnect.');
                alert('Disconnection detected. Please refresh the page ' +
                'to continue. You might have to use the original link provided by Dynata.');
            },
            connectCb: function() {
                // If the user refresh the page, this is not called, it
                // is a normal (re)connect.
                if (node.game.isPaused()) node.game.resume();
            }
        });

        node.on('CONSENT_REJECTING', function() {
            console.log('Rejection detected!')
            node.widgets.destroyAll();
        });

        // No need to show the wait for other players screen in single-player
        // games.
        W.init({ waitScreen: false });

        // Additional debug information while developing the game.
        // this.debugInfo = node.widgets.append('DebugInfo', header)

    });

/////////////////////////////////////////////////////////////////////////////////
stager.extendStep('consent', {
    donebutton: false,
    widget: {
        name: 'Consent',
        disconnect: false
    }
});


    //////////////////////////////////////////////////////////////////
    stager.extendStep('Welcome', {
        frame: 'instructions_start.htm'
    });


    //////////////////////////////////////////////////////////////////////////
    // START OF THE SURVEY
    //////////////////////////////////////////////////////////////////////////


    //////////////////////////////////////////////////////////////////////////
    // Page 1. Age and gender
    stager.extendStep('Part_1_q2', {
        name: "Survey",
        cb: function() {
            W.cssRule('table.choicetable td { text-align: center !important; ' +
            'font-weight: normal; padding-left: 10px; }');
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q2',
            options: {
                simplify: true,
                mainText: '',
                forms: [
                    {
                        name: 'CustomInput',
                        id: 'q2_1',
                        mainText: '<span style="font-weight: normal;color:gray;">Q1</span> How old are you?',
                        width: '95%',
                        type: 'int',
                        min: 18,
                        max: 100,
                        requiredChoice: true,
                    },
                    {
                        id: 'q2_2',
                        mainText: '<span style="font-weight: normal;color:gray;">Q2</span> What is your gender?',
                        choices: ['Male', 'Female', 'Other','Prefer not to say'],
                        requiredChoice: true
                    }
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 3. LOCATION
    stager.extendStep('Part_1_q3', {
        name: "Survey",
        cb: function() {
            W.cssRule('table.choicetable td { text-align: center !important; ' +
            'font-weight: normal; padding-left: 10px; }');
        },
        donebutton: false,
        widget: {
            name: 'ChoiceManager',
            options: {
                forms: [
                    {
                        name: 'Dropdown',
                        id: 'state',
                        mainText: '<span style="font-weight: normal;color:gray;">Q3</span> Select the state in which you currently live. <span style="font-weight: normal;">*</span>',
                        choices: setup.states,
                        tag: 'select', // 'datalist'
                        placeholder: '--',
                        onchange: function(choice, select, widget) {
                            var w = node.widgets.lastAppended;
                            w = w.formsById.district;
                            w.hide();
                            node.game.doneButton.disable();

                            node.get('districts', function(districts) {
                                w.setChoices(districts, true);
                                w.show();
                                W.adjustFrameHeight();
                            }, 'SERVER', { data: choice });
                        }
                    },
                    {
                        name: 'Dropdown',
                        id: 'district',
                        mainText: '<span style="font-weight: normal;color:gray;">Q4</span> Select the district in which you currently live. <span style="font-weight: normal;">*</span>' +
                        '<br><span style="font-weight: normal;">In case you cannot find your district in the list, please choose the nearest one.</span>',
                        tag: 'select', // 'datalist'
                        // Will be auto-filled later.
                        choices: [ '--' ],
                        hidden: true,
                        placeholder: '--',
                        requiredChoice: true,
                        onchange: function() {
                            node.game.doneButton.enable();
                        }

                    }
                ]
            }
        }
    });


////////////////////////////////////////////////////////////////////////////////
// END OF Background SURVEY
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
// Posterior LYL
stager.extendStep('Part4_Posterior_LYL', {
    name: 'Survey',
    frame: 'posterior_LYL.htm',
    donebutton: false,
    cb: function() {
        node.get('districtData', function(data) {

            var left, right, lifeLost;
            left = '<span style="font-size: normal; font-style: italic">0 years</span><br><br>';
            right = '<span style="font-size: normal; font-style: italic">12 years</span><br><br>';

            //console.log(data);

                W.setInnerHTML('district', data.district);
                W.setInnerHTML('districtAgain', data.district);

                lifeLost = data.life_lost;
                lifeLost = Number(lifeLost.toFixed(1));
                node.game.lifeLost = lifeLost;
                W.setInnerHTML('correct', lifeLost);

                node.game.LYL_post = node.widgets.append('ChoiceManager', "T_LYL_post", {
                    id: 'LYL_posterior',
                    simplify: true,
                    panel: false,
                    forms: [
                        {
                            id: 'LYL_posterior_1',
                            mainText: '<span style="font-size:25px">How many years of life do people living in ' +
                            data.district + ' lose on average because of air pollution?</span><br>' +
                            '<span style="color:gray;font-weight: normal">(Move the slider to the desired position.)</span><br><br><br>',
                            hint: false,
                            name: 'Slider',
                            hidden: true,
                            requiredChoice: true,
                            initialValue: 0,
                            min: 0,
                            max: 120,
                            left: left,
                            right: right,
                            displayNoChange: false,
                            type: 'flat',
                            panel: false,
                            texts: {
                                currentValue: function(widget, value) {
                                    let LYL = [
                                        '0', '0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8', '0.9',
                                        '1.0', '1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8', '1.9',
                                        '2.0', '2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7', '2.8', '2.9',
                                        '3.0', '3.1', '3.2', '3.3', '3.4', '3.5', '3.6', '3.7', '3.8', '3.9',
                                        '4.0', '4.1', '4.2', '4.3', '4.4', '4.5', '4.6', '4.7', '4.8', '4.9',
                                        '5.0', '5.1', '5.2', '5.3', '5.4', '5.5', '5.6', '5.7', '5.8', '5.9',
                                        '6.0', '6.1', '6.2', '6.3', '6.4', '6.5', '6.6', '6.7', '6.8', '6.9',
                                        '7.0', '7.1', '7.2', '7.3', '7.4', '7.5', '7.6', '7.7', '7.8', '7.9',
                                        '8.0', '8.1', '8.2', '8.3', '8.4', '8.5', '8.6', '8.7', '8.8', '8.9',
                                        '9.0', '9.1', '9.2', '9.3', '9.4', '9.5', '9.6', '9.7', '9.8', '9.9',
                                        '10.0', '10.1', '10.2', '10.3', '10.4', '10.5', '10.6', '10.7', '10.8', '10.9',
                                        '11.0', '11.1', '11.2', '11.3', '11.4', '11.5', '11.6', '11.7', '11.8', '11.9',
                                        '12'
                                    ];
                                    node.game.contributionAmount = LYL[(value)];
                                    let myAnswer = LYL[(value)];
                                    let stringAnswer = String(myAnswer);
                                    let coloredAnswer = stringAnswer.fontcolor("#ee6933");
                                    let coloredAnswer2 = coloredAnswer.fontsize("25");
                                    return '<span style=\'font-size:18px;\'>You think people living in ' +
                                    data.district + ' lose on average ' + coloredAnswer2 + ' years of life due to air pollution.</span>';
                                }
                            }
                        },
                    ]
                });
            W.show('data', 'flex');
            node.game.doneButton.enable();
        });
    },
    done: function() {
        var w, q1, result;

        node.game.guessBonus = 0;

        w = node.game.LYL_post;

        // DISPLAY 1
        q1 = w.formsById.LYL_posterior_1;
        if (q1.isHidden()) {
            q1.reset(); // removes error.
            q1.show();
            return false;
        }

        if (node.game.contributionAmount == node.game.lifeLost) {
            node.game.guessBonus = 40
            W.setInnerHTML('payoff', '<img src="success.png" width="50px"> Your answer is <b>correct</b>! You receive a bonus of <b>$0.50</b>.<br>')
        }
        else if ((node.game.contributionAmount != node.game.lifeLost) && (node.game.contributionAmount >= (node.game.lifeLost - 0.5)) && (node.game.contributionAmount<= (node.game.lifeLost + 0.5))) {
            node.game.guessBonus = 20
            W.setInnerHTML('payoff', '<img src="almost_correct.png" width="50px"> Your answer is within half a year of the correct value! You receive a bonus of <b>$0.20</b>.<br>')
        }
        else {
            W.setInnerHTML('payoff', '<img src="failure.png" width="50px"> Your answer is <b>not correct</b>. Therefore, you receive no bonus for this question.<br>')
        }
        result = W.gid('result');
        if (result.style.display === 'none') {
            result.style.display = '';
            return false;
        }
        return {
            values: w.getValues(),
            bonus: node.game.guessBonus
        }
    }
});



////////////////////////////////////////////////////////////////////////////////
// PART 4

// LOCUS of CONTROL 1
    stager.extendStep('Part4_LOC1', {
        name: "Survey",
        widget: {
            name: 'ChoiceManager',
            id: 'Part4_LOC1',
            options: {
                simplify: true,
                mainText: '<br><br>' +
                'Indicate how much you agree or disagree with the following statements.',
                forms: [
                    {
                        id: 'LOC_q1',
                        mainText: '<span style="font-weight: normal;color:gray;">Statement 1</span><br>' +
                        '"I have little control of the negative effects of air pollution on my health."',
                        choices: [
                          ['1', 'I strongly agree'],
                          ['2', 'I agree'],
                          ['3', 'I am neutral'],
                          ['4', 'I disagree'],
                          ['5', 'I strongly disagree'],
                        ],
                        requiredChoice: true,
                        shuffleChoices: false,
                        onclick: function(value, removed) {
                          var w, forms, len;
                          forms = node.widgets.lastAppended.formsById
                          w = forms.LOC_q2;
                          w.show();
                        }
                    },
                    {
                        id: 'LOC_q2',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Statement 2</span><br>' +
                        '"There is really no way I can avoid negative effects from air pollution on my health."',
                        choices: [
                          ['1', 'I strongly agree'],
                          ['2', 'I agree'],
                          ['3', 'I am neutral'],
                          ['4', 'I disagree'],
                          ['5', 'I strongly disagree'],
                        ],
                        requiredChoice: true,
                        shuffleChoices: false,
                        hidden: true,
                        onclick: function(value, removed) {
                          var w, forms, len;
                          forms = node.widgets.lastAppended.formsById
                          w = forms.LOC_q3;
                          w.show();
                        }
                    },
                    {
                        id: 'LOC_q3',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Statement 3</span><br>' +
                        '"There is little I can do to reduce the negative effects from air pollution on my health."',
                        choices: [
                          ['1', 'I strongly agree'],
                          ['2', 'I agree'],
                          ['3', 'I am neutral'],
                          ['4', 'I disagree'],
                          ['5', 'I strongly disagree'],
                        ],
                        requiredChoice: true,
                        shuffleChoices: false,
                        hidden: true,
                    }
                ]
            }
        }
    });

    ///////////////////////////////////////////////
    // LOCUS of CONTROL 2
        stager.extendStep('Part4_LOC2', {
            name: "Survey",
            widget: {
                name: 'ChoiceManager',
                id: 'Part4_LOC2',
                options: {
                    simplify: true,
                    mainText: '<br><br>' +
                    'Indicate how much you agree or disagree with the following statements.',
                    forms: [
                        {
                            id: 'LOC_q4',
                            mainText: '<span style="font-weight: normal;color:gray;">Statement 4</span><br>' +
                            '"I often feel helpless when I think about air pollution and its effects on my health."',
                            choices: [
                              ['1', 'I strongly agree'],
                              ['2', 'I agree'],
                              ['3', 'I am neutral'],
                              ['4', 'I disagree'],
                              ['5', 'I strongly disagree'],
                            ],
                            requiredChoice: true,
                            shuffleChoices: false,
                            onclick: function(value, removed) {
                              var w, forms, len;
                              forms = node.widgets.lastAppended.formsById
                              w = forms.LOC_q5;
                              w.show();
                            }
                        },
                        {
                            id: 'LOC_q5',
                            orientation: 'H',
                            mainText: '<span style="font-weight: normal;color:gray;">Statement 5</span><br>' +
                            '"Sometimes I feel that I’m forced to breathe polluted air."',
                            choices: [
                              ['1', 'I strongly agree'],
                              ['2', 'I agree'],
                              ['3', 'I am neutral'],
                              ['4', 'I disagree'],
                              ['5', 'I strongly disagree'],
                            ],
                            requiredChoice: true,
                            shuffleChoices: false,
                            hidden: true,
                        }
                    ]
                }
            }
        });

    ///////////////////////////////////////////////
    // LOCUS of CONTROL 3
        stager.extendStep('Part4_LOC3', {
            name: "Survey",
            widget: {
                name: 'ChoiceManager',
                id: 'Part4_LOC3',
                options: {
                    simplify: true,
                    mainText: '<br><br>' +
                    'Indicate how much you agree or disagree with the following statements.',
                    forms: [
                      {
                                  id: 'LOC_q6',
                                  mainText: '<span style="font-weight: normal;color:gray;">Statement 6</span><br>' +
                                  '"How much air pollution will affect my health in the future mostly depends on me."',
                                  choices: [
                                    ['5', 'I strongly disagree'],
                                    ['4', 'I disagree'],
                                    ['3', 'I am neutral'],
                                    ['2', 'I agree'],
                                    ['1', 'I strongly agree'],
                                  ],
                                  requiredChoice: true,
                                  shuffleChoices: false,
                                  onclick: function(value, removed) {
                                    var w, forms, len;
                                    forms = node.widgets.lastAppended.formsById
                                    w = forms.LOC_q7;
                                    w.show();
                                  }
                              },
                              {
                                  id: 'LOC_q7',
                                  orientation: 'H',
                                  mainText: '<span style="font-weight: normal;color:gray;">Statement 7</span><br>' +
                                  '"I can reduce the negative effect of air pollution on my health as much as I want if I really set my mind to it."',
                                  choices: [
                                    ['5', 'I strongly disagree'],
                                    ['4', 'I disagree'],
                                    ['3', 'I am neutral'],
                                    ['2', 'I agree'],
                                    ['1', 'I strongly agree'],
                                  ],
                                  requiredChoice: true,
                                  shuffleChoices: false,
                                  hidden: true,
                              }
                    ]
                }
            }
        });


///////////////////////////////////////////////
// Perceived Control
    stager.extendStep('Part4_PC', {
        name: "Survey",
        widget: {
            name: 'ChoiceManager',
            id: 'Part4_PC',
            options: {
                simplify: true,
                mainText: '<br><br>' +
                'Indicate how much control do you think you have over the impacts of air pollution on your health.',
                forms: [
                    {
                        id: 'LOC_q8',
                        mainText: '<span style="font-weight: normal;">Please choose the answer that best completes the following sentence:</span><br><br/>' +
                        '"The impact of air pollution on my own health is ..."',
                        choices: [
                          ['1', 'Completely uncontrollable'],
                          ['2', 'Mostly uncontrollable'],
                          ['3', 'Neutral'],
                          ['4', 'Mostly controllable'],
                          ['5', 'Completely controllable'],
                        ],
                        requiredChoice: true,
                        shuffleChoices: false,
                    }
                ]
            }
        }
    });


// /////////////////////////////////////////////////////////////////////////////
// ANY CHANGES in HABITS
stager.extendStep('Part_1_q5', {
       name: "Survey",
       widget: {
           name: 'ChoiceManager',
           options: {
               id: 'q5',
               mainText: '',
               simplify: true,
               forms: [
                   {
                       name: 'ChoiceTableGroup',
                       id: 'q5_prior',
                       mainText: '<span style=\'font-size:18px;font-weight:normal;\'>In your daily life, how often do you engage in the following activitites?</span>',
                       choices: [
                           'Never', 'Very rarely', 'About once per week',
                           'More than once per week', 'Every day'
                       ],
                       items: [
                         {
                           id: 'mask',
                           left: '<span style=\'font-size:16px;font-weight:bold;\'>Wear a face mask</span>'
                         },
                         {
                             id: 'air_pur',
                             left: '<span style=\'font-size:16px;font-weight:bold;\'>Use an air purifier indoors</span>'
                         },
                         {
                             id: 'check',
                             left: '<span style=\'font-size:16px;font-weight:bold;\'>Check the air quality in your area</span>'
                         },
                         {
                             id: 'change',
                             left: '<span style=\'font-size:16px;font-weight:bold;\'>Avoid highy polluted areas when commuting</span>'
                         },
                         {
                             id: 'ventilate',
                             left: '<span style=\'font-size:16px;font-weight:bold;\'>Open the windows to ventilate rooms</span>'
                         },
                         {
                             id: 'dust',
                             left: '<span style=\'font-size:16px;font-weight:bold;\'>Remove dust in your household</span>'
                         },
                         {
                             id: 'nature',
                             left: '<span style=\'font-size:16px;font-weight:bold;\'>Spend time in nature</span>'
                         },
                         {
                             id: 'waste',
                             left: '<span style=\'font-size:16px;font-weight:bold;\'>Burn waste</span>'
                         },
                         {
                             id: 'fires',
                             left: '<span style=\'font-size:16px;font-weight:bold;\'>Handle open fires (e.g., for cooking, heating)</span>'
                         },
                       ],
                       shuffleChoices: false
                   }
               ],
               formsOptions: {
                   requiredChoice: true,
                   shuffleChoices: true
               },
               className: 'centered'
           }
       }
   });

//////////////////////////////////////////////////////////////////////////
// LEAFLET Protection measures ALL
stager.extendStep('Part2_Protection_measures', {
   name: 'Disclaimer',
   frame: 'leaflet_protection.htm',
});

////////////////////////////////////////////////////////////////////////////
// FEEDBACK
////////////////////////////////////////////////////////////////////////////
stager.extendStep('feedback', {
  widget: {
      name: 'ChoiceManager',
      id: 'feedback',
      options: {
          simplify: true,
          mainText: '',
          forms: [
              {
                name: 'Feedback',
                id: 'feedback1',
                minChars: 5,
                requiredChoice: true,
                showSubmit: false,
                mainText: 'Thank you for participating. ' +
                '<br><br>' +
                "If you want to get in touch with us for questions or suggestions, " +
                "please write us an email at <em><span style='color:#bf2b42'>pob.heidelberg@gmail.com</span></em>." +
                '<br><br>' +
                'Two final questions:<br/><br/>' +
                '1. Which questions do you remember from the survey you took with us two weeks ago?',
              },
              {
                name: 'Feedback',
                id: 'feedback2',
                minChars: 5,
                requiredChoice: true,
                showSubmit: false,
                mainText: '' +
                '2. What do you think this study was about?',
              }
            ]
          }
        }
});


//////////////////////////////////////////////////////////////////////////////
// END OF SURVEY
//////////////////////////////////////////////////////////////////////////////
stager.extendStep('end', {
    widget: {
        name: 'EndScreen',
        options: {
          feedback: false,
                  showEmailForm: false,
                  showTotalWin: false,
                  showExitCode: false,
                      texts: {
                          message: 'You have now completed this task and your data has been saved.' +
                          ' Please click "Next" to be redirected to the panel page.<br><br>'
                      },
        }
    },
    init: function() {
        //node.game.doneButton.destroy();
        node.say('end');
    }
});
};
