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
        name: "Part 1: Survey",
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
                        mainText: '<span style="font-weight: normal;color:gray;">Q3</span> How old are you?',
                        width: '95%',
                        type: 'int',
                        min: 0,
                        max: 100,
                        requiredChoice: true,
                    },
                    {
                        id: 'q2_2',
                        mainText: '<span style="font-weight: normal;color:gray;">Q4</span> What is your gender?',
                        choices: ['Male', 'Female', 'Other'],
                        requiredChoice: true
                    }
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 3. LOCATION
    stager.extendStep('Part_1_q3', {
        name: "Part 1: Survey",
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
                        mainText: '<span style="font-weight: normal;color:gray;">Q6</span> Select the state in which you currently live.',
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
                        mainText: '<span style="font-weight: normal;color:gray;">Q7</span> Select the district in which you currently live.',
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
                        mainText: '<span style="font-weight: normal;color:gray;">Q8</span> Do you live in a village or a town/city?',
                        choices: [ 'Village', 'Town/city'],
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
        name: "Part 1: Survey",
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
                        name: 'CustomInput',
                        id: 'q4_1',
                        mainText: '<span style="font-weight: normal;color:gray;">Q9</span> How many people live in your household?<br>',
                        hint: '(Think about everyone that lives at least eight months per year in your house. Answer should include yourself in the count.)',
                        width: '95%',
                        type: 'int',
                        requiredChoice: true,
                        min: 1
                    },
                    {
                        id: 'q4_2',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q10</span> What is the highest educational level that you have completed?',
                        choices: ['No formal education','Primary school','Secondary school','Vocational training','Bachelor degree','Masters degree or higher'],
                        shuffleChoices: false,
                        requiredChoice: true
                    },
                    { // THIS NEEDS TO BE MADE CONDITIONAL ON DISTRICT
                        id: 'q4_3',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q11</span> In 2020, what was the total annual income of your household?<br>' +
                        '<span style="font-weight: normal;"> Please refer to the total income of ALL members living in your household in 2020, ' +
                        'before any taxes or deductions. This includes:<br> '+
                        '- wages and salaries from all jobs <br>' +
                        '- the revenue from self-employment <br>' +
                        '- all income from casual labour.</span>',
                        choices: ['Less than 2,00,000 INR',
                                  '2,00,000 INR – 5,00,000 INR',
                                  '5,00,000 INR – 10,00,000 INR',
                                  '10,00,000 INR – 20,00,000 INR',
                                  '20,00,000 INR or more'],
                        shuffleChoices: false,
                        requiredChoice: true,
                        choicesSetSize: 2
                    }
                ]
            }
        }
    });


    //////////////////////////////////////////////////////////////////////////
    // Part1. WORK and Commute
    stager.extendStep('Part_1_q5', {
        name: "Part 1: Survey",
        cb: function() {
            W.cssRule('table.choicetable td { text-align: left !important; ' +
            'font-weight: normal; padding-left: 10px; }');
        },
        widget: {
            name: 'ChoiceManager',
            id: 'q5',
            options: {
                simplify: true,
                mainText: '',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'q5_1',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q12</span> Are you currently employed?',
                        choices: [ 'No','Yes'],
                        shuffleChoices: false,
                        requiredChoice: true,
                        onclick: function(value, removed) {
                            var w1, w2, forms, len;
                            forms = node.widgets.lastAppended.formsById
                            len = forms.q5_1.choices.length - 1;
                            w1 = forms.q5_2;
                            w2 = forms.q5_4;
                            if (this.isChoiceCurrent(len)) {
                                w1.show();
                                w2.show({ scroll: false });
                            }
                            else {
                                w1.hide();
                                w2.hide();
                            }
                            W.adjustFrameHeight();
                        }
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q5_2',
                        orientation: 'H',
                        choicesSetSize: 2,
                        mainText: '<span style="font-weight: normal;color:gray;">Q13</span> In which sector do you work?',
                        choices: ['Mining',
                        'Manufacturing',
                        'Electricty/water/gas/waste',
                        'Construction',
                        'Transportation',
                        'Buying and selling',
                        'Financial/insurance/real estate services',
                        'Personal services',
                        'IT',
                        'Education',
                        'Health',
                        'Public administration',
                        'Professional/scientific/technical activities',
                        'Other'],
                        shuffleChoices: false,
                        hidden: true,
                        requiredChoice: true,
                        onclick: function(value, removed) {
                            var w, forms, len;
                            forms = node.widgets.lastAppended.formsById
                            len = forms.q5_2.choices.length - 1;
                            w = forms.q5_3;
                            if (this.isChoiceCurrent(len)) w.show();
                            else w.hide();
                        }
                    },
                    {
                        name: 'CustomInput',
                        id: 'q5_3',
                        mainText: '<span style="font-weight: normal;color:gray;">Q13b</span> Please specify.',
                        width: '100%',
                        hidden: true,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q5_4',
                        orientation: 'V',
                        mainText: '<span style="font-weight: normal;color:gray;">Q14</span> During a typical day, how long does it take you to go from home to work?<br>',
                        hint: '(Think about the number of minutes you need for a one-way commute.)',
                        choices: ['I work at home',
                        'Less than 10 minutes',
                        '10-30 minutes',
                        '30-60 minutes',
                        'More than 60 minutes'],
                        shuffleChoices: false,
                        hidden: true,
                        requiredChoice: true
                    }
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Part 1. HOME environment
    stager.extendStep('Part_1_q6', {
        name: "Part 1: Survey",
        cb: function() {
            W.cssRule('table.choicetable td { text-align: left !important; ' +
            'font-weight: normal; padding-left: 10px; }');
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q6',
            options: {
                simplify: true,
                mainText: '',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'q6_1',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q15</span> What do you use as lighting fuel at home?<br>',
                        choices: [ 'Kerosene','Electricity','Gas','Solar lamp','Other'],
                        hint: '(Select <em><strong>all</strong></em> that apply.)',
                        shuffleChoices: false,
                        selectMultiple: 4,
                        requiredChoice: true,
                        onclick: function(value, removed) {
                            var w1, forms, len;
                            forms = node.widgets.lastAppended.formsById
                            len = forms.q6_1.choices.length - 1;
                            w1 = forms.q6_2;
                            if (this.isChoiceCurrent(len)) {
                                w1.show();
                            }
                            else {
                                w1.hide();
                            }
                            W.adjustFrameHeight();
                        }
                    },
                    {
                        name: 'CustomInput',
                        id: 'q6_2',
                        mainText: '<span style="font-weight: normal;color:gray;">Q15b</span> Which other?',
                        width: '100%',
                        hidden: true,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q6_3',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q16</span> What do you use for cooking fuel at home?<br>',
                        choices: ['Dung cakes','Wood','Coal','Kerosene','Gas','Electric stove','Other'],
                        hint: '(Select <em><strong>all</strong></em> that apply.)',
                        selectMultiple: 7,
                        shuffleChoices: false,
                        requiredChoice: true,
                        onclick: function(value, removed) {
                            var w1, forms, len;
                            forms = node.widgets.lastAppended.formsById
                            len = forms.q6_3.choices.length - 1;
                            w1 = forms.q6_4;
                            if (this.isChoiceCurrent(len)) {
                                w1.show();
                            }
                            else {
                                w1.hide();
                            }
                            W.adjustFrameHeight();
                        }
                    },
                    {
                        name: 'CustomInput',
                        id: 'q6_4',
                        mainText: '<span style="font-weight: normal;color:gray;">Q16b</span> Which other?',
                        width: '100%',
                        hidden: true,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q6_5',
                        orientation: 'V',
                        mainText: '<span style="font-weight: normal;color:gray;">Q17</span> In your home, in which room is food prepared usually?',
                        choices: ['Cooking is done in the main living area.','Cooking is done in a separate kitchen.'],
                        shuffleChoices: true,
                        requiredChoice: true,
                    }
                ]
            }
        }
    });


    //////////////////////////////////////////////////////////////////////////
    // Part 1. Protection against pollution: HOME
    stager.extendStep('Part_1_q7', {
        name: "Part 1: Survey",
        cb: function() {
            W.cssRule('table.choicetable td { text-align: center !important; ' +
            'font-weight: normal; padding-left: 10px; }');
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q7',
            options: {
                simplify: true,
                forms: [
                    {
                        id: 'q7_1',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q18</span> Do you own an air conditioner (AC) at home?',
                        choices: ['No','Yes'],
                        shuffleChoices: false,
                        requiredChoice: true,
                        hidden: false,
                    },
                    {
                        id: 'q7_2',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q19</span> Do you own an air purifier or particle filter at home?',
                        choices: ['No','Yes'],
                        shuffleChoices: false,
                        requiredChoice: true,
                        hidden: false,
                        onclick: function(value, removed) {
                            var w1, w2, forms, len;
                            forms = node.widgets.lastAppended.formsById
                            len = forms.q7_2.choices.length - 1;
                            w1 = forms.q7_3;
                            if (this.isChoiceCurrent(len)) {
                                w1.show();
                            }
                            else {
                                w1.hide();
                            }
                            W.adjustFrameHeight();
                        }
                    },
                    {
                        name: 'CustomInput',
                        id: 'q7_3',
                        orientation: 'V',
                        mainText: '<span style="font-weight: normal;color:gray;">Q19b</span> Which year did you purchase your air purifier',
                        width: '95%',
                        hidden: true,
                        type:'int',
                        min: 1900,
                        max: 2021,
                        requiredChoice: true,
                    },
                    {
                        id: 'q7_4',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q20</span> How many people in your circle of family and friends own an air purifier?',
                        choices: ['Nobody','Very few','Less than half','Most of them','Everyone',"I don't know"],
                        shuffleChoices: false,
                        requiredChoice: true,
                        hidden: false,
                    },
                    {
                        id: 'q7_5',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q21</span> When you are home, do you do something to reduce your own exposure to air pollution?',
                        choices:['No','Yes'],
                        shuffleChoices: false,
                        requiredChoice: true,
                        onclick: function(value, removed) {
                            var w1, forms, len;
                            forms = node.widgets.lastAppended.formsById
                            len = forms.q7_5.choices.length - 1;
                            w1 = forms.q7_6;
                            if (this.isChoiceCurrent(len)) {
                                w1.show();
                            }
                            else {
                                w1.hide();
                            }
                            W.adjustFrameHeight();
                        }
                    },
                    {
                        name: 'CustomInput',
                        id: 'q7_6',
                        orientation: 'V',
                        mainText: '<span style="font-weight: normal;color:gray;">Q22</span> What do you do to reduce air pollution in your home?',
                        width: '95%',
                        hidden: true,
                        requiredChoice: true,
                    }
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // PAST ILLNESSES
    stager.extendStep('Part_1_q8', {
        name: "Part 1: Survey",
        cb: function() {
            W.cssRule('table.choicetable td { text-align: left !important; ' +
            'font-weight: normal; padding-left: 10px; }');
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q8',
            options: {
                simplify: true,
                mainText: '',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'q8_1',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q23</span> How often do you do physical exercise?<br>',
                        hint:'(Think of when you play sports, go jogging, go to the gym, practice yoga/pilates at home etc.)',
                        choices: [ 'Never','Very rarely','Once a month','Every week','Several times per week'],
                        shuffleChoices: false,
                        requiredChoice: true
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q8_2',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q24</span> Do you smoke tobacco (cigarettes, hookah, bidi, etc.)?',
                        choices: [ 'Yes','No'],
                        shuffleChoices: false,
                        requiredChoice: true
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q8_3',
                        orientation: 'V',
                        mainText: '<span style="font-weight: normal;color:gray;">Q25</span> In the past 5 years, did YOU have any of the following health conditions?<br>',
                        hint: '(Select <strong><em>all</strong></em> that apply.)',
                        choices: ["Allergies",'High blood pressure','Heart disease','Lung disease','Diabetes','None','Prefer not to say'],
                        shuffleChoices: false,
                        requiredChoice: true,
                        selectMultiple: true
                    }
                ]
            }
        }
    });



    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////
    // PART II
    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    // Instructions Part II
    stager.extendStep('Instructions_Part_2', {
        name: 'Part 2: Instructions',
        frame: 'instructions_part2.htm'
    });


    //////////////////////////////////////////////////////////////////////////
    // LEAFLET P1
    stager.extendStep('Part2_Air_pollution_and_its_sources', {
        name: 'Part 2: Reading and comprehension',
        frame: 'leaflet_p1.htm',
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'P1_q',
            options: {
                simplify: true,
                mainText: 'Based on the information provided in the box above, find the correct answer to the questions below.<br>' +
                '<span style="color:gray;font-size:14px;">(All your answers need to be correct in order to be able to proceed to the next page.) </span>',
                forms: [
                    {
                        id: 'P1_q1',
                        orientation: 'V',
                        mainText: '<span style="font-weight: normal;color:gray;">Q1</span> Which of the following statements is correct?',
                        choices: ['Air pollution is mostly generated outdoors, but not indoors.',
                        'Air pollution can be generated both indoors and outdoors.',
                        'Air pollution is mostly generated indoors, but not outdoors.'],
                        correctChoice: 1,
                    },
                    {
                        id: 'P1_q2',
                        orientation: 'V',
                        mainText: '<span style="font-weight: normal;color:gray;">Q2</span> Which of the following statements is correct?',
                        choices: ['In India, only industries cause air pollution.',
                        'In India, air pollution is generated by many sources and everyone is responsible to different degrees for the air pollution problem.'],
                        correctChoice: 1,
                    }
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // LEAFLET P2
    stager.extendStep('Part2_Pollution_and_life_expectancy', {
        name: 'Part 2: Reading and comprehension',
        frame: 'leaflet_p4.htm',
        widget: {
            name: 'ChoiceManager',
            id: 'P2_q',
            options: {
                simplify: true,
                mainText: 'Based on the information provided in the box above, find the correct answer to the questions below.<br>' +
                '<span style="color:gray;font-size:14px;">(All your answers need to be correct in order to be able to proceed to the next page.) </span>',
                forms: [
                    {
                        id: 'P2_q1',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q6</span> How many years of life do we lose on average by being exposed for a long time to air pollution that is 10 &mu;/m<sup>3</sup> higher than the WHO recommended level?<br>',
                        choices: ["0 years", "0.25 years", "0.5 years", "1 year", "2 years"],
                        correctChoice: 3,
                    },
                    {
                        id: 'P2_q2',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q7</span> How many years of life do we lose on average by being exposed for a long time to air pollution that is 30 &mu;/m<sup>3</sup> higher than the WHO recommended level?<br>',
                        choices: ["0 years", "1 year", "2 years", "3 years", "5 years"],
                        correctChoice: 3,
                    }
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // LEAFLET P3
    stager.extendStep('Part2_Air_pollution_damages_your_health', {
        name: 'Part 2: Reading and comprehension',
        frame: 'leaflet_p3.htm',
        widget: {
            name: 'ChoiceManager',
            id: 'P3_q',
            options: {
                simplify: true,
                mainText: 'Based on the information provided in the box above, find the correct answer to the questions below.<br>' +
                '<span style="color:gray;font-size:14px;">(All your answers need to be correct in order to be able to proceed to the next page.) </span>',
                forms: [
                    {
                        id: 'P3_q1',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q5</span> Which of the following health conditions are caused by exposure to air pollution?<br>',
                        hint: '<span style="color:gray;font-size:14px;">(There are several correct answers and you have to find all of them.)</span>',
                        // Number of choices per row/column.
                        choicesSetSize: 6,
                        choices: ["HIV/AIDS", "Hepatitis",
                        "Lung cancer", "Heart disease", "Respiratory infections"],
                        selectMultiple: true,
                        correctChoice: [2,3,4],
                    }
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // LEAFLET P4
    stager.extendStep('Part2_Protection_measures', {
        name: 'Part 2: Reading and comprehension',
        frame: 'leaflet_protection.htm',
        widget: {
            name: 'ChoiceManager',
            id: 'P4_q',
            options: {
                simplify: true,
                mainText: 'Based on the information provided in the box above, find the correct answer to the questions below.<br>' +
                '<span style="color:gray;font-size:14px;">(All your answers need to be correct in order to be able to proceed to the next page.) </span>',
                forms: [
                    {
                        id: 'P4_q1',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q5</span> Which of the following measures help with protecting your health from air pollution?<br>',
                        hint: '<span style="color:gray;font-size:14px;">(There are several correct answers and you have to find all of them.)</span>',
                        // Number of choices per row/column.
                        choicesSetSize: 5,
                        choices: ["Ventilating the kitchen", "Using clean cooking and heating fuels",
                        "Wearing a face mask while outdoors", "Drinking cold water"],
                        selectMultiple: true,
                        correctChoice: [0,1,2],
                    }
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // LEAFLET P5
    stager.extendStep('Part2_Protection_measures_T', {
        name: 'Part 2: Reading and comprehension',
        frame: 'leaflet_protection_T.htm',
        widget: {
            name: 'ChoiceManager',
            id: 'P4_T_q',
            options: {
                simplify: true,
                mainText: 'This time, think about <b>yourself</b> and <b>your opinion</b> on how to protect yourself against air pollution.<br>',
                forms: [
                    {
                        id: 'P4_T_q1',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q5</span> In your opinion, which 3 measures from the leaflet above are the MOST EFFECTIVE to protect yourself against air pollution?<br>',
                        hint: '<span style="color:gray;font-size:14px;">(Select 3 measures.)</span>',
                        // Number of choices per row/column.
                        choicesSetSize: 4,
                        choices: ["Wear a face mask", "Avoid exercising outdoors in congested areas",
                        "Check the air quality and avoid congested areas", "Spend time in nature",
                        "Remove dust often", "Use an air purifier", "Use clean cooking and heating fuels", "Ventilate well the kitchen"],
                        selectMultiple: 3,
                        shuffleChoices: false,
                        requiredChoice: 3,
                    },
                    {
                        id: 'P4_T_q2',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q5</span> Which protective measure(s) from the leaflet above are the MOST CONVENIENT for you to implement?<br>',
                        hint: '<span style="color:gray;font-size:14px;">(Select at least 1.)</span>',
                        // Number of choices per row/column.
                        choicesSetSize: 4,
                        choices: ["Wear a face mask", "Avoid exercising outdoors in congested areas",
                        "Check the air quality and avoid congested areas", "Spend time in nature",
                        "Remove dust often", "Use an air purifier", "Use clean cooking and heating fuels", "Ventilate well the kitchen"],
                        selectMultiple: true,
                        shuffleChoices: false
                    },
                    {
                        name: 'CustomInput',
                        id: 'P4_T_q3',
                        mainText: '<span style="font-weight: normal;color:gray;">Q6</span> What OTHER measures than the ones included in the leaflet above come to your mind that help with protecting yourself against air pollution?',
                        width: '95%',
                        requiredChoice: true,
                    },
                    {
                        id: 'P4_T_q4',
                        orientation: 'H',
                        mainText: '<img src="Leaflet_images/exclamation-mark.png" width="25px" /> Try to remember these protection measures and apply them whenever you can! They can help protect your health against air pollution!<br/><br>' +
                        '<span style="font-weight: normal;color:gray;">Q7</span> How likely do you think you are to remember a few of these protection measures?<br>',
                        choices: ["Very likely", "Likely",
                        "Neutral", "Not very likely", "Very unlikely"],
                        shuffleChoices: false,
                        requiredChoice: true
                    }
                ]
            },
        },
    });


    //////////////////////////////////////////////////////////////////////////
    // Pollution in your district
    stager.extendStep('Part2_Pollution_in_your_district', {
        name: 'Part 2: Reading and comprehension',
        frame: 'leaflet_p5.htm',
        donebutton: false,
        cb: function() {
            node.get('districtData', function(data) {

                var state_fig = data.state.replace(/ /g, '_');
                state_fig = state_fig.replace(/&/g, 'and');
                state_fig = state_fig.replace(/-/g, '_');

                var district_fig = data.district.replace(/ /g, '_');
                district_fig = district_fig.replace(/&/g, 'and');
                district_fig = district_fig.replace(/-/g, '_');

                var image = 'district_maps/' + state_fig + '_' + district_fig + '.png';

                W.gid('img').src = image;

                console.log(data);
                W.setInnerHTML('state', data.state);
                W.setInnerHTML('district', data.district);
                W.setInnerHTML('districtAgain', data.district);
                W.setInnerHTML('districtAgainAgain', data.district);
                W.setInnerHTML('pm25', data.pm25.toFixed(2));
                W.setInnerHTML('higher', (data.pm25 / 5).toFixed(0));
                W.setInnerHTML('years', data.life_lost.toFixed(1));

                node.game.controlQuestions = node.widgets.append('ChoiceManager', "ComprehquestionsL5", {
                    id: 'p5_q',
                    // ref: 'controlQuestions',
                    mainText: 'Based on the information <em>provided</em> in the box above, find the correct answer to the questions below.<br>' +
                    '<span style="color:gray;font-size:14px;">(All your answers need to be correct in order to be able to proceed to the next page.) </span>',
                    simplify: true,
                    forms: [
                        {
                            id: 'p5_q1',
                            orientation: 'H',
                            mainText: '<span style="font-weight: normal;color:gray;">Q8</span> What is the WHO recommendation for the annual average PM 2.5 concentrations?<br>',
                            choices: [
                                ['0', "0 &mu;/m<sup>3</sup>"],
                                ['5', "5 &mu;/m<sup>3</sup>"],
                                ['15', "15 &mu;/m<sup>3</sup>"],
                                ['30', "30 &mu;/m<sup>3</sup>"],
                            ],
                            correctChoice: 1,
                        },
                        {
                            id: 'p5_q2',
                            orientation: 'H',
                            mainText: '<span style="font-weight: normal;color:gray;">Q9</span> On average, how many years of life does a person living in your district lose because of air pollution?<br>',
                            choices: [
                                (data.life_lost * 0.5).toFixed(1) + ' years',
                                (data.life_lost * 0.8).toFixed(1) + ' years',
                                data.life_lost.toFixed(1) + ' years',
                                (data.life_lost * 1.2).toFixed(1) + ' years',
                                (data.life_lost * 1.5).toFixed(1) + ' years'
                            ],
                            correctChoice: 2,
                        }
                    ]
                    // formsOptions: {
                    //     requiredChoice: true
                    // }
                });

                W.show('data', 'flex');
                node.game.doneButton.enable();
            });
        },
        done: function() {
            return node.game.controlQuestions.getValues();
        }
    });



        ////////////////////////////////////////////////////////////////////////////
        // FEEDBACK
        stager.extendStep('feedback', {
            widget: {
                name: 'Feedback',
                options: {
                    title: false,
                    panel: false,
                    minChars: 50,
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
                    '<li>Was the map of your district loading correctly?</li>' +
                    '<li>How can we improve the study?</li></ol>'
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
                    feedback: false
                }
            },
            init: function() {
                node.game.doneButton.destroy();
                node.say('end');
            }
        });
    };
