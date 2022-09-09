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
                'to continue. You might have to use the original link provided on MTurk.');
            },
            connectCb: function() {
                // If the user refresh the page, this is not called, it
                // is a normal (re)connect.
                if (node.game.isPaused()) node.game.resume();
            }
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
        widget: 'Consent'
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
                        mainText: '<span style="font-weight: normal;color:gray;">Q4</span> Select the county in which you currently live. <span style="font-weight: normal;">*</span>' +
                        '<br><span style="font-weight: normal;">In case you cannot find your county in the list, please choose the nearest one.</span>',
                        tag: 'select', // 'datalist'
                        // Will be auto-filled later.
                        choices: [ '--' ],
                        hidden: true,
                        placeholder: '--',
                        requiredChoice: true,
                        onchange: function() {
                            node.game.doneButton.enable();
                        }

                    },
                    {
                        id: 'q3_3',
                        // orientation: 'V',
                        mainText: '<span style="font-weight: normal;color:gray;">Q5</span> Do you live in rural or urban area?',
                        choices: [ 'Rural', 'Urban'],
                        shuffleChoices: true,
                        requiredChoice: true
                    }
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 4. Nr household members + HH INCOME
    stager.extendStep('Part_1_q4', {
        name: "Survey",
        cb: function() {
            W.cssRule('table.choicetable td { text-align: center !important; ' +
            'font-weight: normal; padding-left: 10px; }');
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q4',
            options: {
                simplify: true,
                mainText: '',
                forms: [
                    {
                        id: 'q4_2',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q6</span> What is the highest educational level that you have completed?',
                        choices: ['Eighth grade or less','High school','College degree','Masters degree','Doctorate or higher'],
                        shuffleChoices: false,
                        requiredChoice: true
                    },
                    {
                        name: 'CustomInput',
                        id: 'q4_1',
                        mainText: '<span style="font-weight: normal;color:gray;">Q7</span> How many people live in your household?<br>',
                        hint: '(Think about everyone that lives at least eight months per year in your house. Answer should include yourself.)',
                        width: '95%',
                        type: 'int',
                        requiredChoice: true,
                        min: 1
                    },
                    {
                        id: 'q4_3',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q8</span> In 2021, what was the total annual income of your household?<br>' +
                        '<span style="font-weight: normal;"> Please refer to the total income of ALL members living in your household in 2021, ' +
                        'before any taxes or deductions. This includes:<br> '+
                        '- wages and salaries from all jobs <br>' +
                        '- the revenue from self-employment <br>' +
                        '- all income from casual labour.</span>',
                        choices: [
                          ["Group 1", 'Less than $15,000'],
                          ["Group 2", '$15,000 – $25,000'],
                          ["Group 3", '$25,000 – $40,000'],
                          ["Group 4", '$40,000 – $50,000'],
                          ["Group 5", '$50,000 – $70,000'],
                          ["Group 6", '$70,000 – $85,000'],
                          ["Group 7", '$85,000 – $110,000'],
                          ["Group 8", '$110,000 - $140,000'],
                          ["Group 9", '$140,000 - $200,000'],
                          ["Group 10", 'More than $200,000']
                      ],
                        shuffleChoices: false,
                        requiredChoice: true,
                        choicesSetSize: 2
                    },
                    {
                        id: 'q4_4',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q9</span> What is your age group?',
                        choices: ['18 - 25','26 - 25','31 - 35','36 - 40','41 – 45','46 – 50','51 – 55','56 – 60','61 – 65','66 +'],
                        shuffleChoices: false,
                        requiredChoice: true,
                        choicesSetSize: 4
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
    name: 'Part 3',
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
                            mainText: '<span style="font-weight: normal;color:gray;">Q1</span> <span style="font-size:25px">How many years of life do people living in ' +
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
                                    let coloredAnswer2 = stringAnswer.fontsize("25");
                                    return '<span style=\'font-size:20px;\'>You think people living in ' +
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
            node.game.guessBonus = 0.50
            W.setInnerHTML('payoff', '<img src="success.png" width="50px"> Your answer is <b>correct</b>! You receive a bonus of <b>$0.50</b>.<br>')
        }
        else if ((node.game.contributionAmount != node.game.lifeLost) && (node.game.contributionAmount >= (node.game.lifeLost - 0.5)) && (node.game.contributionAmount<= (node.game.lifeLost + 0.5))) {
            node.game.guessBonus = 0.20
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

////////////////////////////////////////////////////
// LYL: Deciles of Pollution
//////////////////////////////////////
stager.extendStep('Part2_Prior_LYL_home', {
    name: "Survey",
    frame: 'prior_LYL.htm',
    donebutton: false,
    cb: function() {
      node.get('districtData', function(data) {

          //console.log(data);
          W.setInnerHTML('district', data.district);
          W.setInnerHTML('state', data.state);
          let myDistrict = data.district;
          let stringDistrict = String(myDistrict);
          // State
          let myState = data.state;
          let stringState = String(myState);


          node.game.Qprior = node.widgets.append('ChoiceManager', "container", {
            id: 'LYL_prior_home',
            simplify: true,
            panel: false,
            forms: [
                    {
                        id: 'LYL_prior',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q10</span> Think of <span style="color:red;">your county </span> now. ' +
                                  'In your opinion, which group is ' + stringDistrict +  ' (' + data.state + ') part of?',
                        choices: [
                          ['Group 1', '<span style=\'font-size:14px;font-weight:normal;\'>Group 1</span>'],
                          ['Group 2', '<span style=\'font-size:14px;font-weight:normal;\'>Group 2</span>'],
                          ['Group 3', '<span style=\'font-size:14px;font-weight:normal;\'>Group 3</span>'],
                          ['Group 4', '<span style=\'font-size:14px;font-weight:normal;\'>Group 4</span>'],
                          ['Group 5', '<span style=\'font-size:14px;font-weight:normal;\'>Group 5</span>'],
                          ['Group 6', '<span style=\'font-size:14px;font-weight:normal;\'>Group 6</span>'],
                          ['Group 7', '<span style=\'font-size:14px;font-weight:normal;\'>Group 7</span>'],
                          ['Group 8', '<span style=\'font-size:14px;font-weight:normal;\'>Group 8</span>'],
                          ['Group 9', '<span style=\'font-size:14px;font-weight:normal;\'>Group 9</span>'],
                          ['Group 10', '<span style=\'font-size:14px;font-weight:normal;\'>Group 10</span>'],
                            ],
                        shuffleChoices: false,
                        requiredChoice: true,
                        onclick: function(value, removed) {
                          var w, forms, len;
                          forms = node.widgets.lastAppended.formsById
                          // len = forms.P3_q1_1.choices.length - 1;
                          w = forms.T_confident;
                          w.show();
                          // w.hide();
                        }
                      },
                      {
                          id: 'T_confident',
                          orientation: 'H',
                          mainText: '<span style="font-weight: normal;color:gray;">Q11</span> How confident are you about your answer to the previous question?</span>',
                          choices: [
                            ['1', 'Not confident at all'],
                            ['2', 'Not very confident'],
                            ['3', 'Neutral'],
                            ['4', 'Quite confident'],
                            ['5', 'Completely confident']
                          ],
                          shuffleChoices: false,
                          requiredChoice: true,
                          hidden: true,
                          onclick: function(value, removed) {
                            var w, forms, len;
                            forms = node.widgets.lastAppended.formsById
                            // len = forms.P3_q1_1.choices.length - 1;
                            w = forms.pollution_worry;
                            w.show();
                            // w.hide();
                          }
                        },
                        {
                        id: 'pollution_worry',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q12</span> In general, how worried are you about the air pollution in ' + stringDistrict +  ' (' + data.state + ')?',
                        left: 'Not worried at all',
                        right: 'Very worried',
                        choices: [ '1', '2', '3', '4', '5', '6', '7'],
                        requiredChoice: true,
                        hidden: true
                      }
          ]
    });
    W.show('data', 'flex');
    node.game.doneButton.enable();
});
},
done: function() {
    return node.game.Qprior.getValues();
}
});

//////////////////////////////////////////////////////////////////////////
// LEAFLET Protection measures ALL
stager.extendStep('Part2_Protection_measures', {
    name: 'Part 1',
    frame: 'leaflet_protection.htm',
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
    }
]
}
}
});

///////////////////////////////////////////////
// LOCUS of CONTROL 3
stager.extendStep('Part4_LOC3', {
name: "Part 3",
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
              ['1', 'I strongly agree'],
              ['2', 'I agree'],
              ['3', 'I am neutral'],
              ['4', 'I disagree'],
              ['5', 'I strongly disagree'],
            ],
            requiredChoice: true,
            shuffleChoices: false,
        },
        {
            id: 'LOC_q7',
            orientation: 'H',
            mainText: '<span style="font-weight: normal;color:gray;">Statement 7</span><br>' +
            '"I can reduce the negative effect of air pollution on my health as much as I want if I really set my mind to it."',
            choices: [
              ['1', 'I strongly agree'],
              ['2', 'I agree'],
              ['3', 'I am neutral'],
              ['4', 'I disagree'],
              ['5', 'I strongly disagree'],
            ],
            requiredChoice: true,
            shuffleChoices: false,
        }
    ]
}
}
});


///////////////////////////////////////////////
// Perceived Control
stager.extendStep('Part4_PC', {
name: "Part 3",
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


///////////////////////////////////////////////
// Perceived Control
stager.extendStep('Part4_Poll_Severe', {
    name: "Part 4",
    widget: {
        name: 'ChoiceManager',
        id: 'Part4_Poll_Severe',
        options: {
            simplify: true,
            forms: [
                {
                    id: 'LOC_q9',
                    orientation: 'V',
                    mainText: '<span style="font-weight: normal;"><br><br>' +
                    'Compare the <b>global health burden</b> from air pollution to that from other major causes of death, such as ' +
                    "communicable diseases like tuberculosis " +
                    "and HIV/AIDS, illnesses caused by smoking and poor water sanitation, and death from conflicts and " +
                    'war. In your opinion, how large is the death burden from air pollution?',
                    choices: [
                      ['1', 'Air pollution causes <b>more</b> deaths than any of these other causes.'],
                      ['2', 'Air pollution causes <b>a similar number</b> of deaths as these other causes.'],
                      ['3', 'Air pollution causes <b>less</b> deaths than these other causes.'],
                    ],
                    requiredChoice: true,
                    shuffleChoices: false,
                }
            ]
        }
    }
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
                'We are very interested in ' +
                'hearing your <strong>feedback</strong> about the ' +
                'following points:<br/><br/><em><ol>' +
                '<li>Was the survey too long or too short?</li>' +
                '<li>Did you find any question unclear or ' +
                'uncomfortable?</li>' +
                '<li>Did you experience any technical difficulty?</li>' +
                '<li>Were the images and maps loading correctly?</li>' +
                '<li>How can we improve the study?</li></ol>' +
                "If you do not have any comment, just type 'nothing' in the box below.",
              },
              {
                name: 'Feedback',
                id: 'feedback2',
                mainText: 'What do you think this study is about?',
                requiredChoice: true,
                minChars: 5,
                showSubmit: false
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
            texts: {
                message: 'You have now completed this task and your data has been saved.' +
                ' Please go back to the Amazon Mechanical Turk web site and submit the HIT.<br><br>'
            },
        }
    },
    init: function() {
        node.game.doneButton.destroy();
        node.say('end');
    }
});
};
