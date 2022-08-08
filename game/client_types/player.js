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
    stager.extendStep('memory_intro', {
        frame: 'instructions_memory.htm',
        name: 'Part 5',
        cb: function() {
            W.setInnerHTML('bonus', node.game.settings.MEMORY_BONUS);
        }
    });

    //////////////////////////////////////////////////////////////////
    stager.extendStep('memory_learn', {
        frame: 'memory_learn.htm',
        name: 'Part 5',
        donebutton: false,
        cb: function() {
            W.setInnerHTML('bonus', node.game.settings.MEMORY_BONUS);
        },
        init: function() {
            this.visualTimer = node.widgets.append('VisualTimer', W.getHeader());
        },
        exit: function() {
            if (node.game.visualTimer) {
                node.game.visualTimer.destroy();
                node.game.visualTimer = null;
            }
        },
    });

    ///Pictures
    ///Positive setup
    // <a href="https://ibb.co/NZh0B2H"><img src="https://i.ibb.co/6ghKC0f/calculator02c.jpg" alt="calculator02c" border="0" /></a>
    // <a href="https://ibb.co/Js3nt8D"><img src="https://i.ibb.co/HHh74R5/candelabra.jpg" alt="candelabra" border="0" /></a>
    // <a href="https://ibb.co/VSNJyVt"><img src="https://i.ibb.co/wWLBHyR/carbattery.jpg" alt="carbattery" border="0" /></a>
    // <a href="https://ibb.co/SBJtJQ1"><img src="https://i.ibb.co/89XrXzR/dice02a.jpg" alt="dice02a" border="0" /></a>
    // <a href="https://ibb.co/h1Lm9pt"><img src="https://i.ibb.co/vvVjq2K/paintbrush03a.jpg" alt="paintbrush03a" border="0" /></a>
    // <a href="https://ibb.co/5Kv6GYQ"><img src="https://i.ibb.co/g4w3mv0/rope02.jpg" alt="rope02" border="0" /></a>
    // <a href="https://ibb.co/TvcHpcM"><img src="https://i.ibb.co/C1BnNBK/sponge02a.jpg" alt="sponge02a" border="0" /></a>
    // <a href="https://ibb.co/86YzD9V"><img src="https://i.ibb.co/NZT16Kz/thumbtack02b.jpg" alt="thumbtack02b" border="0" /></a>

    ///Negative setup
    // <a href="https://ibb.co/FzV0f3z"><img src="https://i.ibb.co/vkYQrqk/boxtruck.jpg" alt="boxtruck" border="0" /></a>
    // <a href="https://ibb.co/QjQVF77"><img src="https://i.ibb.co/G3pDvff/butterfly.jpg" alt="butterfly" border="0" /></a>
    // <a href="https://ibb.co/K54MVf9"><img src="https://i.ibb.co/51pNsS5/envelope02b.jpg" alt="envelope02b" border="0" /></a>
    // <a href="https://ibb.co/PGhMPKc"><img src="https://i.ibb.co/nMcBY97/lighter03b.jpg" alt="lighter03b" border="0" /></a>
    // <a href="https://ibb.co/fkYkhRv"><img src="https://i.ibb.co/y6n6wTS/spatula01.jpg" alt="spatula01" border="0" /></a>
    // <a href="https://ibb.co/V93T77H"><img src="https://i.ibb.co/Pjtg77T/usbcable01b.jpg" alt="usbcable01b" border="0" /></a>
    // <a href="https://ibb.co/CVg22LX"><img src="https://i.ibb.co/xzWHHZc/watermelon02b.jpg" alt="watermelon02b" border="0" /></a>


    stager.extendStep('memory_test1', {
        name: 'Part 5',
        frame: 'memory1.htm',
        cb: function() {
            node.game.memory1 = node.widgets.append('ChoiceManager', "container", {
                id: 'memory_test_1',
                // ref: 'controlQuestions',
                mainText: '',
                simplify: true,
                forms: [
                    {
                        id: 'mt1',
                        mainText: '<span style="font-weight: normal;color:gray;">T1</span> Have you seen this item earlier in the task? (You get $'+ node.game.settings.MEMORY_BONUS + ' if you answer correctly.)',
                        choices: ['No', 'Yes'],
                        requiredChoice: true
                    }
                ]
            });
        },
        done: function() {
            node.game.bonusMemory1 = 0;
            var q1, q2;
            q1 = node.game.memory1;
            var answer = q1.formsById.mt1.getValues().value
            console.log(answer);

            if (answer === 'No'){
                node.game.bonusMemory1 = node.game.settings.MEMORY_BONUS;
            }

            q2 = q1.formsById.mt1;
            if (q2.isHidden()) {
                q2.reset(); // removes error.
                q2.show();
                return false;
            }
            q1.hide();
            return { m1_bonus: node.game.bonusMemory1 };
        }
    });

    stager.extendStep('memory_test2', {
        name: 'Part 5',
        frame: 'memory2.htm',
        cb: function() {
            node.game.memory2 = node.widgets.append('ChoiceManager', "container", {
                id: 'memory_test_2',
                // ref: 'controlQuestions',
                mainText: '',
                simplify: true,
                forms: [
                    {
                        id: 'mt2',
                        mainText: '<span style="font-weight: normal;color:gray;">T2</span> Have you seen this item earlier in the task? (You get $'+ node.game.settings.MEMORY_BONUS + ' if you answer correctly.)',
                        choices: ['No', 'Yes'],
                        requiredChoice: true
                    }
                ]
            });
        },
        done: function() {
            node.game.bonusMemory2 = 0;
            var q1, q2;
            q1 = node.game.memory2;
            var answer = q1.formsById.mt2.getValues().value
            console.log(answer);

            if (answer === 'Yes'){
                node.game.bonusMemory2 = node.game.settings.MEMORY_BONUS;
            }

            q2 = q1.formsById.mt2;
            if (q2.isHidden()) {
                q2.reset(); // removes error.
                q2.show();
                return false;
            }
            q1.hide();
            return { m2_bonus: node.game.bonusMemory2 };
        }
    });


    //////////////////////////////////////////////////////////////////

    stager.extendStep('memory_test3', {
        name: 'Part 5',
        frame: 'memory3.htm',
        cb: function() {
            node.game.memory3 = node.widgets.append('ChoiceManager', "container", {
                id: 'memory_test_3',
                // ref: 'controlQuestions',
                mainText: '',
                simplify: true,
                forms: [
                    {
                        id: 'mt3',
                        mainText: '<span style="font-weight: normal;color:gray;">T3</span> Have you seen this item earlier in the task? (You get $'+ node.game.settings.MEMORY_BONUS + ' if you answer correctly.)',
                        choices: ['No', 'Yes'],
                        requiredChoice: true
                    }
                ]
            });
        },
        done: function() {
            node.game.bonusMemory3 = 0;
            var q1, q2;
            q1 = node.game.memory3;
            var answer = q1.formsById.mt3.getValues().value
            console.log(answer);

            if (answer === 'Yes'){
                node.game.bonusMemory3 = node.game.settings.MEMORY_BONUS;
            }

            q2 = q1.formsById.mt3;
            if (q2.isHidden()) {
                q2.reset(); // removes error.
                q2.show();
                return false;
            }
            q1.hide();
            return { m3_bonus: node.game.bonusMemory3 };
        }
    });

    stager.extendStep('memory_test4', {
        name: 'Part 5',
        frame: 'memory4.htm',
        cb: function() {
            node.game.memory4 = node.widgets.append('ChoiceManager', "container", {
                id: 'memory_test_4',
                // ref: 'controlQuestions',
                mainText: '',
                simplify: true,
                forms: [
                    {
                        id: 'mt4',
                        mainText: '<span style="font-weight: normal;color:gray;">T4</span> Have you seen this item earlier in the task? (You get $'+ node.game.settings.MEMORY_BONUS + ' if you answer correctly.)',
                        choices: ['No', 'Yes'],
                        requiredChoice: true
                    }
                ]
            });
        },
        done: function() {
            node.game.bonusMemory4 = 0;
            var q1, q2;
            q1 = node.game.memory4;
            var answer = q1.formsById.mt4.getValues().value
            console.log(answer);

            if (answer === 'No'){
                node.game.bonusMemory4 = node.game.settings.MEMORY_BONUS;
            }

            q2 = q1.formsById.mt4;
            if (q2.isHidden()) {
                q2.reset(); // removes error.
                q2.show();
                return false;
            }
            q1.hide();
            return { m4_bonus: node.game.bonusMemory4 };
        }
    });

    stager.extendStep('memory_test5', {
        name: 'Part 5',
        frame: 'memory5.htm',
        cb: function() {
            node.game.memory5 = node.widgets.append('ChoiceManager', "container", {
                id: 'memory_test_5',
                // ref: 'controlQuestions',
                mainText: '',
                simplify: true,
                forms: [
                    {
                        id: 'mt5',
                        mainText: '<span style="font-weight: normal;color:gray;">T5</span> Have you seen this item earlier in the task? (You get $'+ node.game.settings.MEMORY_BONUS + ' if you answer correctly.)',
                        choices: ['No', 'Yes'],
                        requiredChoice: true
                    }
                ]
            });
        },
        done: function() {
            node.game.bonusMemory5 = 0;
            var q1, q2;
            q1 = node.game.memory5;
            var answer = q1.formsById.mt5.getValues().value
            console.log(answer);

            if (answer === 'Yes'){
                node.game.bonusMemory5 = node.game.settings.MEMORY_BONUS;
            }

            q2 = q1.formsById.mt5;
            if (q2.isHidden()) {
                q2.reset(); // removes error.
                q2.show();
                return false;
            }
            q1.hide();
            return { m5_bonus: node.game.bonusMemory5 };
        }
    });

    stager.extendStep('memory_test6', {
        name: 'Part 5',
        frame: 'memory6.htm',
        cb: function() {
            node.game.memory6 = node.widgets.append('ChoiceManager', "container", {
                id: 'memory_test_6',
                // ref: 'controlQuestions',
                mainText: '',
                simplify: true,
                forms: [
                    {
                        id: 'mt6',
                        mainText: '<span style="font-weight: normal;color:gray;">T6</span> Have you seen this item earlier in the task? (You get $'+ node.game.settings.MEMORY_BONUS + ' if if you answer correctly.)',
                        choices: ['No', 'Yes'],
                        requiredChoice: true
                    }
                ]
            });
        },
        done: function() {
            node.game.bonusMemory6 = 0;
            var q1, q2;
            q1 = node.game.memory6;
            var answer = q1.formsById.mt6.getValues().value
            console.log(answer);

            if (answer === 'No'){
                node.game.bonusMemory6 = node.game.settings.MEMORY_BONUS;
            }

            q2 = q1.formsById.mt6;
            if (q2.isHidden()) {
                q2.reset(); // removes error.
                q2.show();
                return false;
            }
            q1.hide();
            return { m6_bonus: node.game.bonusMemory6 };
        }
    });

    stager.extendStep('memory_test7', {
        name: 'Part 5',
        frame: 'memory7.htm',
        cb: function() {
            node.game.memory7 = node.widgets.append('ChoiceManager', "container", {
                id: 'memory_test_7',
                // ref: 'controlQuestions',
                mainText: '',
                simplify: true,
                forms: [
                    {
                        id: 'mt7',
                        mainText: '<span style="font-weight: normal;color:gray;">T7</span> Have you seen this item earlier in the task? (You get $'+ node.game.settings.MEMORY_BONUS + ' if if you answer correctly.)',
                        choices: ['No', 'Yes'],
                        requiredChoice: true
                    }
                ]
            });
        },
        done: function() {
            node.game.bonusMemory7 = 0;
            var q1, q2;
            q1 = node.game.memory7;
            var answer = q1.formsById.mt7.getValues().value
            console.log(answer);

            if (answer === 'Yes'){
                node.game.bonusMemory7 = node.game.settings.MEMORY_BONUS;
            }

            q2 = q1.formsById.mt7;
            if (q2.isHidden()) {
                q2.reset(); // removes error.
                q2.show();
                return false;
            }
            q1.hide();
            return { m7_bonus: node.game.bonusMemory7 };
        }
    });

    stager.extendStep('memory_test8', {
        name: 'Part 5',
        frame: 'memory8.htm',
        cb: function() {
            node.game.memory8 = node.widgets.append('ChoiceManager', "container", {
                id: 'memory_test_8',
                // ref: 'controlQuestions',
                mainText: '',
                simplify: true,
                forms: [
                    {
                        id: 'mt8',
                        mainText: '<span style="font-weight: normal;color:gray;">T8</span> Have you seen this item earlier in the task? (You get $'+ node.game.settings.MEMORY_BONUS + ' if if you answer correctly.)',
                        choices: ['No', 'Yes'],
                        requiredChoice: true
                    }
                ]
            });
        },
        done: function() {
            node.game.bonusMemory8 = 0;
            var q1, q2;
            q1 = node.game.memory8;
            var answer = q1.formsById.mt8.getValues().value
            console.log(answer);

            if (answer === 'Yes'){
                node.game.bonusMemory8 = node.game.settings.MEMORY_BONUS;
            }

            q2 = q1.formsById.mt8;
            if (q2.isHidden()) {
                q2.reset(); // removes error.
                q2.show();
                return false;
            }
            q1.hide();
            return { m8_bonus: node.game.bonusMemory8 };
        }
    });

    stager.extendStep('memory_test9', {
        name: 'Part 5',
        frame: 'memory9.htm',
        cb: function() {
            node.game.memory9 = node.widgets.append('ChoiceManager', "container", {
                id: 'memory_test_9',
                // ref: 'controlQuestions',
                mainText: '',
                simplify: true,
                forms: [
                    {
                        id: 'mt9',
                        mainText: '<span style="font-weight: normal;color:gray;">T9</span> Have you seen this item earlier in the task? (You get $'+ node.game.settings.MEMORY_BONUS + ' if if you answer correctly.)',
                        choices: ['No', 'Yes'],
                        requiredChoice: true
                    }
                ]
            });
        },
        done: function() {
            node.game.bonusMemory9 = 0;
            var q1, q2;
            q1 = node.game.memory9;
            var answer = q1.formsById.mt9.getValues().value
            console.log(answer);

            if (answer === 'No'){
                node.game.bonusMemory9 = node.game.settings.MEMORY_BONUS;
            }

            q2 = q1.formsById.mt9;
            if (q2.isHidden()) {
                q2.reset(); // removes error.
                q2.show();
                return false;
            }
            q1.hide();
            return { m9_bonus: node.game.bonusMemory9 };
        }
    });

    stager.extendStep('memory_test10', {
        name: 'Part 5',
        frame: 'memory10.htm',
        cb: function() {
            node.game.memory10 = node.widgets.append('ChoiceManager', "container", {
                id: 'memory_test_10',
                // ref: 'controlQuestions',
                mainText: '',
                simplify: true,
                forms: [
                    {
                        id: 'mt10',
                        mainText: '<span style="font-weight: normal;color:gray;">T10</span> Have you seen this item earlier in the task? (You get $'+ node.game.settings.MEMORY_BONUS + ' if if you answer correctly.)',
                        choices: ['No', 'Yes'],
                        requiredChoice: true
                    }
                ]
            });
        },
        done: function() {
            node.game.bonusMemory10 = 0;
            var q1, q2;
            q1 = node.game.memory10;
            var answer = q1.formsById.mt10.getValues().value
            console.log(answer);

            if (answer === 'No'){
                node.game.bonusMemory10 = node.game.settings.MEMORY_BONUS;
            }

            q2 = q1.formsById.mt10;
            if (q2.isHidden()) {
                q2.reset(); // removes error.
                q2.show();
                return false;
            }
            q1.hide();
            return { m10_bonus: node.game.bonusMemory10 };
        }
    });

    stager.extendStep('memory_test11', {
        name: 'Part 5',
        frame: 'memory11.htm',
        cb: function() {
            node.game.memory11 = node.widgets.append('ChoiceManager', "container", {
                id: 'memory_test_11',
                // ref: 'controlQuestions',
                mainText: '',
                simplify: true,
                forms: [
                    {
                        id: 'mt11',
                        mainText: '<span style="font-weight: normal;color:gray;">T11</span> Have you seen this item earlier in the task? (You get $'+ node.game.settings.MEMORY_BONUS + ' if if you answer correctly.)',
                        choices: ['No', 'Yes'],
                        requiredChoice: true
                    }
                ]
            });
        },
        done: function() {
            node.game.bonusMemory11 = 0;
            var q1, q2;
            q1 = node.game.memory11;
            var answer = q1.formsById.mt11.getValues().value
            console.log(answer);

            if (answer === 'Yes'){
                node.game.bonusMemory11 = node.game.settings.MEMORY_BONUS;
            }

            q2 = q1.formsById.mt11;
            if (q2.isHidden()) {
                q2.reset(); // removes error.
                q2.show();
                return false;
            }
            q1.hide();
            return { m11_bonus: node.game.bonusMemory11 };
        }
    });

    stager.extendStep('memory_test12', {
        name: 'Part 5',
        frame: 'memory12.htm',
        cb: function() {
            node.game.memory12 = node.widgets.append('ChoiceManager', "container", {
                id: 'memory_test_12',
                // ref: 'controlQuestions',
                mainText: '',
                simplify: true,
                forms: [
                    {
                        id: 'mt12',
                        mainText: '<span style="font-weight: normal;color:gray;">T12</span> Have you seen this item earlier in the task? (You get $'+ node.game.settings.MEMORY_BONUS + ' if if you answer correctly.)',
                        choices: ['No', 'Yes'],
                        requiredChoice: true
                    }
                ]
            });
        },
        done: function() {
            node.game.bonusMemory12 = 0;
            var q1, q2;
            q1 = node.game.memory12;
            var answer = q1.formsById.mt12.getValues().value
            console.log(answer);

            if (answer === 'No'){
                node.game.bonusMemory12 = node.game.settings.MEMORY_BONUS;
            }

            q2 = q1.formsById.mt12;
            if (q2.isHidden()) {
                q2.reset(); // removes error.
                q2.show();
                return false;
            }
            q1.hide();
            return { m12_bonus: node.game.bonusMemory12 };
        }
    });

    stager.extendStep('memory_test13', {
        name: 'Part 5',
        frame: 'memory13.htm',
        cb: function() {
            node.game.memory13 = node.widgets.append('ChoiceManager', "container", {
                id: 'memory_test_13',
                // ref: 'controlQuestions',
                mainText: '',
                simplify: true,
                forms: [
                    {
                        id: 'mt13',
                        mainText: '<span style="font-weight: normal;color:gray;">T13</span> Have you seen this item earlier in the task? (You get $'+ node.game.settings.MEMORY_BONUS + ' if if you answer correctly.)',
                        choices: ['No', 'Yes'],
                        requiredChoice: true
                    }
                ]
            });
        },
        done: function() {
            node.game.bonusMemory13 = 0;
            var q1, q2;
            q1 = node.game.memory13;
            var answer = q1.formsById.mt13.getValues().value
            console.log(answer);

            if (answer === 'No'){
                node.game.bonusMemory13 = node.game.settings.MEMORY_BONUS;
            }

            q2 = q1.formsById.mt13;
            if (q2.isHidden()) {
                q2.reset(); // removes error.
                q2.show();
                return false;
            }
            q1.hide();
            return { m13_bonus: node.game.bonusMemory13 };
        }
    });

    stager.extendStep('memory_test14', {
        name: 'Part 5',
        frame: 'memory14.htm',
        cb: function() {
            node.game.memory14 = node.widgets.append('ChoiceManager', "container", {
                id: 'memory_test_14',
                // ref: 'controlQuestions',
                mainText: '',
                simplify: true,
                forms: [
                    {
                        id: 'mt14',
                        mainText: '<span style="font-weight: normal;color:gray;">T14</span> Have you seen this item earlier in the task? (You get $'+ node.game.settings.MEMORY_BONUS + ' if if you answer correctly.)',
                        choices: ['No', 'Yes'],
                        requiredChoice: true
                    }
                ]
            });
        },
        done: function() {
            node.game.bonusMemory14 = 0;
            var q1, q2;
            q1 = node.game.memory14;
            var answer = q1.formsById.mt14.getValues().value
            console.log(answer);

            if (answer === 'Yes'){
                node.game.bonusMemory14 = node.game.settings.MEMORY_BONUS;
            }

            q2 = q1.formsById.mt14;
            if (q2.isHidden()) {
                q2.reset(); // removes error.
                q2.show();
                return false;
            }
            q1.hide();
            return { m14_bonus: node.game.bonusMemory14 };
        }
    });

    stager.extendStep('memory_test15', {
        name: 'Part 5',
        frame: 'memory15.htm',
        cb: function() {
            node.game.memory15 = node.widgets.append('ChoiceManager', "container", {
                id: 'memory_test_15',
                // ref: 'controlQuestions',
                mainText: '',
                simplify: true,
                forms: [
                    {
                        id: 'mt15',
                        mainText: '<span style="font-weight: normal;color:gray;">T15</span> Have you seen this item earlier in the task? (You get $'+ node.game.settings.MEMORY_BONUS + ' if if you answer correctly.)',
                        choices: ['No', 'Yes'],
                        requiredChoice: true
                    }
                ]
            });
        },
        done: function() {
            node.game.bonusMemory15 = 0;
            var q1, q2;
            q1 = node.game.memory15;
            var answer = q1.formsById.mt15.getValues().value
            console.log(answer);

            if (answer === 'Yes'){
                node.game.bonusMemory15 = node.game.settings.MEMORY_BONUS;
            }

            q2 = q1.formsById.mt15;
            if (q2.isHidden()) {
                q2.reset(); // removes error.
                q2.show();
                return false;
            }
            q1.hide();
            return { m15_bonus: node.game.bonusMemory15 };
        }
    });

    stager.extendStep('memory_results', {
        name: 'Part 5 - Your results',
        frame: 'memory_results.htm',
        cb: function() {
            var h1, memory_payoff, memory_correct;
            h1 = node.game;
            memory_correct = h1.bonusMemory1 + h1.bonusMemory2 + h1.bonusMemory3 + h1.bonusMemory4 + h1.bonusMemory5 +
            h1.bonusMemory6 + h1.bonusMemory7 + h1.bonusMemory8 + h1.bonusMemory9 + h1.bonusMemory10 + h1.bonusMemory11 +
            h1.bonusMemory12 + h1.bonusMemory13 + h1.bonusMemory14 + h1.bonusMemory15;
            memory_correct = memory_correct * 50;
            memory_correct = memory_correct.toFixed();
            memory_payoff = memory_correct * node.game.settings.MEMORY_BONUS;
            memory_payoff = memory_payoff.toFixed(2);
            W.setInnerHTML('bonus', node.game.settings.MEMORY_BONUS);
            W.setInnerHTML('correct', memory_correct);
            W.setInnerHTML('payoff', memory_payoff);
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
        name: "Part 1",
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
        name: "Part 1",
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
                        mainText: '<span style="font-weight: normal;color:gray;">Q4</span> Select the state in which you currently live. <span style="font-weight: normal;">*</span>',
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
                        mainText: '<span style="font-weight: normal;color:gray;">Q5</span> Select the county in which you currently live. <span style="font-weight: normal;">*</span>' +
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
                        mainText: '<span style="font-weight: normal;color:gray;">Q6</span> Do you live in rural or urban area?',
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
        name: "Part 1",
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
                        mainText: '<span style="font-weight: normal;color:gray;">Q7</span> What is the highest educational level that you have completed?',
                        choices: ['High School','Bachelor degree','Masters degree','Doctorate or higher'],
                        shuffleChoices: false,
                        requiredChoice: true
                    },
                    {
                        name: 'CustomInput',
                        id: 'q4_1',
                        mainText: '<span style="font-weight: normal;color:gray;">Q8</span> How many people live in your household?<br>',
                        hint: '(Think about everyone that lives at least eight months per year in your house. Answer should include yourself.)',
                        width: '95%',
                        type: 'int',
                        requiredChoice: true,
                        min: 1
                    },
                    { // THIS NEEDS TO BE MADE CONDITIONAL ON DISTRICT
                        id: 'q4_3',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q9</span> In 2021, what was the total annual income of your household?<br>' +
                        '<span style="font-weight: normal;"> Please refer to the total income of ALL members living in your household in 2021, ' +
                        'before any taxes or deductions. This includes:<br> '+
                        '- wages and salaries from all jobs <br>' +
                        '- the revenue from self-employment <br>' +
                        '- all income from casual labour.</span>',
                        choices: [
                          ["Group 1", 'Less than $15,600'],
                          ["Group 2", '$15,600 – $27,026'],
                          ["Group 3", '$27,026 – $39,535'],
                          ["Group 4", '$39,535 – $52,179'],
                          ["Group 5", '$52,179 – $67,521'],
                          ["Group 6", '$67,521 – $85,076'],
                          ["Group 7", '$85,076 – $107,908'],
                          ["Group 8", '$107,908 - $141,110'],
                          ["Group 9", '$141,110 - $201,126'],
                          ["Group 10", 'More than $201,126']
                      ],
                        shuffleChoices: false,
                        requiredChoice: true,
                        choicesSetSize: 2
                    }
                ]
            }
        }
    });

    // stager.extendStep('Part_1_q5', {
    //     name: "Part 1",
    //     widget: {
    //         name: 'ChoiceManager',
    //         options: {
    //             id: 'q5',
    //             mainText: '',
    //             simplify: true,
    //             forms: [
    //                 {
    //                     name: 'ChoiceTableGroup',
    //                     id: 'q5_prior',
    //                     mainText: '<span style="font-weight: normal;color:gray;">Q10</span> <span style=\'font-size:18px;font-weight:normal;\'>In your daily life, how often do you engage in the following activitites?</span>',
    //                     choices: [
    //                         'Never', 'Very rarely', 'About once per week',
    //                         'More than once per week', 'Every day'
    //                     ],
    //                     items: [
    //                       {
    //                         id: 'mask',
    //                         left: '<span style=\'font-size:16px;font-weight:bold;\'>Wear a face mask</span>'
    //                       },
    //                       {
    //                           id: 'air_pur',
    //                           left: '<span style=\'font-size:16px;font-weight:bold;\'>Use an air purifier indoors</span>'
    //                       },
    //                       {
    //                           id: 'check',
    //                           left: '<span style=\'font-size:16px;font-weight:bold;\'>Check the air quality in your area</span>'
    //                       },
    //                       {
    //                           id: 'change',
    //                           left: '<span style=\'font-size:16px;font-weight:bold;\'>Change your commute route or time schedule to avoid high pollution areas</span>'
    //                       },
    //                       {
    //                           id: 'ventilate',
    //                           left: '<span style=\'font-size:16px;font-weight:bold;\'>Opening the window to ventilate rooms</span>'
    //                       },
    //                       {
    //                           id: 'nature',
    //                           left: '<span style=\'font-size:16px;font-weight:bold;\'>Spend time in nature</span>'
    //                       },
    //                       {
    //                           id: 'fires',
    //                           left: '<span style=\'font-size:16px;font-weight:bold;\'>Waste burning or handling of open fires</span>'
    //                       },
    //                       {
    //                           id: 'dust',
    //                           left: '<span style=\'font-size:16px;font-weight:bold;\'>Remove dust in your household</span>'
    //                       }
    //                     ],
    //                     shuffleChoices: false
    //                 }
    //             ],
    //             formsOptions: {
    //                 requiredChoice: true,
    //                 shuffleChoices: true
    //             },
    //             className: 'centered'
    //         }
    //     }
    // });


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
        name: 'Part 2',
        frame: 'leaflet_p1.htm',
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'P1_q',
            options: {
                simplify: true,
                mainText: 'Based on the box above, find the correct answer to the questions below.<br>' +
                '<span style="color:gray;font-size:14px;">(All your answers need to be correct in order to be able to proceed to the next page.) </span>',
                forms: [
                    {
                        id: 'P1_q1',
                        orientation: 'V',
                        mainText: '<span style="font-weight: normal;color:gray;">Q1</span> Which of the following statements is correct? <span style="font-weight: normal;">*</span>',
                        choices: ['Air pollution is mostly generated outdoors, but not indoors.',
                        'Air pollution can be generated both indoors and outdoors.',
                        'Air pollution is mostly generated indoors, but not outdoors.'],
                        correctChoice: 1,
                    },
                    {
                        id: 'P1_q2',
                        orientation: 'V',
                        mainText: '<span style="font-weight: normal;color:gray;">Q2</span> Which of the following statements is correct? <span style="font-weight: normal;">*</span>',
                        choices: ['Only industries cause air pollution.',
                        'Air pollution is generated by many sources and everyone is responsible to different degrees for the air pollution problem.'],
                        correctChoice: 1,
                    }
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // LEAFLET P2
    stager.extendStep('Part2_Pollution_and_life_expectancy', {
        name: 'Part 2',
        frame: 'leaflet_p4.htm',
        widget: {
            name: 'ChoiceManager',
            id: 'P2_q',
            options: {
                simplify: true,
                mainText: 'Based on the box above, find the correct answer to the questions below.<br>',
                forms: [
                    {
                        id: 'P2_q1',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q3</span> How many years of life do people lose on average by being exposed to annual air pollution concentrations that are 20 &mu;/m<sup>3</sup> higher than the WHO recommended level? <span style="font-weight: normal;">*</span>',
                        choices: ["0 years", "0.25 years", "0.5 years", "1 year", "2 years"],
                        correctChoice: 4,
                    },
                    // {
                    //     id: 'P2_q2',
                    //     orientation: 'H',
                    //     mainText: '<span style="font-weight: normal;color:gray;">Q4</span> What is the world average number of life years lost due to air pollution? <span style="font-weight: normal;">*</span>',
                    //     choices: ["0 years", "1 year", "1.6 years", "1.9 years", "5 years"],
                    //     correctChoice: 3,
                    // }
                ]
            }
        }
    });

    // ////////////////////////////////////////////////////////////////////////////////
    // // PRIOR LYL
    //     stager.extendStep('Part2_Prior_LYL_home', {
    //         name: 'Part 2',
    //         frame: 'prior_home.htm',
    //         donebutton: false,
    //         cb: function() {
    //             node.get('districtData', function(data) {
    //
    //               let myDistrict = data.district;
    //               let stringDistrict = String(myDistrict);
    //               let coloredDistrict = stringDistrict.fontcolor("#ee6933");
    //
    //             node.game.Q_impact = node.widgets.append('ChoiceManager', "T_impact", {
    //                     id: 'T_impact_q',
    //                     simplify: true,
    //                     panel: false,
    //                     forms: [
    //                       {
    //                           id: 'LYL_prior_home',
    //                           mainText: '<span style="font-weight: normal;color:gray;">Q5</span> How many years of life do people living in ' +
    //                           coloredDistrict + ' lose on average because of air pollution?<br>' +
    //                           '<span style="color:gray;font-weight: normal">(Move the slider to the desired position.)</span><br><br><br>',
    //                           hint: false,
    //                           name: 'Slider',
    //                           hidden: true,
    //                           requiredChoice: true,
    //                           initialValue: 0,
    //                           min: 0,
    //                           max: 120,
    //                           left: '0 years',
    //                           right: '12 years',
    //                           displayNoChange: false,
    //                           type: 'flat',
    //                           panel: false,
    //                           texts: {
    //                               currentValue: function(widget, value) {
    //                                   let LYL = [
    //                                       '0', '0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8', '0.9',
    //                                       '1.0', '1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8', '1.9',
    //                                       '2.0', '2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7', '2.8', '2.9',
    //                                       '3.0', '3.1', '3.2', '3.3', '3.4', '3.5', '3.6', '3.7', '3.8', '3.9',
    //                                       '4.0', '4.1', '4.2', '4.3', '4.4', '4.5', '4.6', '4.7', '4.8', '4.9',
    //                                       '5.0', '5.1', '5.2', '5.3', '5.4', '5.5', '5.6', '5.7', '5.8', '5.9',
    //                                       '6.0', '6.1', '6.2', '6.3', '6.4', '6.5', '6.6', '6.7', '6.8', '6.9',
    //                                       '7.0', '7.1', '7.2', '7.3', '7.4', '7.5', '7.6', '7.7', '7.8', '7.9',
    //                                       '8.0', '8.1', '8.2', '8.3', '8.4', '8.5', '8.6', '8.7', '8.8', '8.9',
    //                                       '9.0', '9.1', '9.2', '9.3', '9.4', '9.5', '9.6', '9.7', '9.8', '9.9',
    //                                       '10.0', '10.1', '10.2', '10.3', '10.4', '10.5', '10.6', '10.7', '10.8', '10.9',
    //                                       '11.0', '11.1', '11.2', '11.3', '11.4', '11.5', '11.6', '11.7', '11.8', '11.9',
    //                                       '12'
    //                                   ];
    //                                   node.game.contributionAmount = LYL[(value)];
    //                                   let myAnswer = LYL[(value)];
    //                                   let stringAnswer = String(myAnswer);
    //                                   let coloredAnswer = stringAnswer.fontcolor("#ee6933");
    //                                   return '<span style=\'font-size:20px;\'>You think people living in ' +
    //                                   //data.district + ' lose on average ' + LYL[(value)] + ' years of life due to air pollution.</span>';
    //                                   data.district + ' lose on average ' + coloredAnswer + ' years of life due to air pollution.</span>';
    //                               }
    //                           }
    //                       },
    //                     ]
    //                 });
    //
    //                 W.show('data', 'flex');
    //                 node.game.doneButton.enable();
    //             });
    //         },
    //         done: function() {
    //             var w, q1, q2;
    //
    //             w = node.game.Q_impact;
    //
    //             // DISPLAY 1
    //             q1 = w.formsById.LYL_prior_home;
    //             if (q1.isHidden()) {
    //                 q1.reset(); // removes error.
    //                 q1.show();
    //                 return false;
    //             }
    //
    //             // DISPLAY 2
    //             q2 = w.formsById.T_confident;
    //             if (!q2) {
    //                 node.widgets.last.addForm({
    //                     id: 'T_confident',
    //                     orientation: 'H',
    //                     mainText: '<span style="font-weight: normal;color:gray;">Q6</span> How confident are you about your answer to the previous question?</span>',
    //                     choices: [
    //                       ['1', 'Not confident at all'],
    //                       ['2', 'Not very confident'],
    //                       ['3', 'Neutral'],
    //                       ['4', 'Quite confident'],
    //                       ['5', 'Completely confident']
    //                     ],
    //                     shuffleChoices: false,
    //                     requiredChoice: true,
    //                 });
    //                 return false;
    //             }
    //
    //             return w.getValues();
    //         }
    //     });

        ////////////////////////////////////////////////////
        // LYL Prior: Deciles of Pollution
        //////////////////////////////////////
        stager.extendStep('Part2_Prior_LYL_home', {
            name: "Part 2",
            frame: 'prior_LYL.htm',
            donebutton: false,
            cb: function() {
              node.get('districtData', function(data) {

                  //console.log(data);
                  W.setInnerHTML('district', data.district);
                  let myDistrict = data.district;
                  let stringDistrict = String(myDistrict);


                  node.game.Qprior = node.widgets.append('ChoiceManager', "container", {
                    id: 'LYL_prior_home',
                    simplify: true,
                    panel: false,
                    forms: [
                            {
                                id: 'LYL_prior',
                                orientation: 'H',
                                mainText: '<span style="font-weight: normal;color:gray;">Q5</span> Think of <span style="color:red;">YOUR county </span> now. ' +
                                          'In your opinion, which group is your county, ' + stringDistrict + ', part of?',
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
                                  mainText: '<span style="font-weight: normal;color:gray;">Q6</span> How confident are you about your answer to the previous question?</span>',
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
                                mainText: '<span style="font-weight: normal;color:gray;">Q3</span> In general, how worried are you about air pollution?',
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
});


////////////////////////////////////////////////////////////////////////////////
// PRIOR LYL
    // stager.extendStep('Part2_Prior_LYL_Austria', {
    //     name: 'Part 2',
    //     frame: 'prior_LYL.htm',
    //     donebutton: true,
    //     cb: function() {
    //     //    node.get('districtData', function(data) {
    //
    //         node.game.Q_impact = node.widgets.append('ChoiceManager', "T_impact", {
    //                 id: 'T_impact_q',
    //                 simplify: true,
    //                 panel: false,
    //                 forms: [
    //                   {
    //                       id: 'LYL_prior_Austria',
    //                       mainText: '<span style="font-weight: normal;color:gray;">Q7</span> How many years of life do people living in <span style="color:#ee6933;">Austria</span>, a ' +
    //                       'country in central Europe, lose on average because of air pollution?<br>' +
    //                       '<span style="color:gray;font-weight: normal">(Move the slider to the desired position.)</span><br><br><br>',
    //                       hint: false,
    //                       name: 'Slider',
    //                       hidden: false,
    //                       requiredChoice: true,
    //                       initialValue: 0,
    //                       min: 0,
    //                       max: 120,
    //                       left: '0 years',
    //                       right: '12 years',
    //                       displayNoChange: false,
    //                       type: 'flat',
    //                       panel: false,
    //                       texts: {
    //                           currentValue: function(widget, value) {
    //                               let LYL = [
    //                                   '0', '0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8', '0.9',
    //                                   '1.0', '1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8', '1.9',
    //                                   '2.0', '2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7', '2.8', '2.9',
    //                                   '3.0', '3.1', '3.2', '3.3', '3.4', '3.5', '3.6', '3.7', '3.8', '3.9',
    //                                   '4.0', '4.1', '4.2', '4.3', '4.4', '4.5', '4.6', '4.7', '4.8', '4.9',
    //                                   '5.0', '5.1', '5.2', '5.3', '5.4', '5.5', '5.6', '5.7', '5.8', '5.9',
    //                                   '6.0', '6.1', '6.2', '6.3', '6.4', '6.5', '6.6', '6.7', '6.8', '6.9',
    //                                   '7.0', '7.1', '7.2', '7.3', '7.4', '7.5', '7.6', '7.7', '7.8', '7.9',
    //                                   '8.0', '8.1', '8.2', '8.3', '8.4', '8.5', '8.6', '8.7', '8.8', '8.9',
    //                                   '9.0', '9.1', '9.2', '9.3', '9.4', '9.5', '9.6', '9.7', '9.8', '9.9',
    //                                   '10.0', '10.1', '10.2', '10.3', '10.4', '10.5', '10.6', '10.7', '10.8', '10.9',
    //                                   '11.0', '11.1', '11.2', '11.3', '11.4', '11.5', '11.6', '11.7', '11.8', '11.9',
    //                                   '12'
    //                               ];
    //                               node.game.contributionAmount = LYL[(value)];
    //                               let myAnswer = LYL[(value)];
    //                               let stringAnswer = String(myAnswer);
    //                               let coloredAnswer = stringAnswer.fontcolor("#ee6933");
    //                               return '<span style=\'font-size:20px;\'>You think people living in Austria' +
    //                               ' lose on average ' + coloredAnswer + ' years of life due to air pollution.</span>';
    //                           }
    //                       }
    //                   },
    //                 ]
    //             });
    //
    //           //  W.show('data', 'flex');
    //             node.game.doneButton.enable();
    //       //  });
    //     },
    //     done: function() {
    //         //var w, q1, q2;
    //         var w, q2;
    //
    //         w = node.game.Q_impact;
    //
    //         // DISPLAY 1
    //         //q1 = w.formsById.LYL_prior_Austria;
    //         //if (q1.isHidden()) {
    //           //  q1.reset(); // removes error.
    //           //  q1.show();
    //         //    return false;
    //         //}
    //
    //         // DISPLAY 2
    //         q2 = w.formsById.T_confident_decoy;
    //         if (!q2) {
    //             node.widgets.last.addForm({
    //                 id: 'T_confident_decoy',
    //                 orientation: 'H',
    //                 mainText: '<span style="font-weight: normal;color:gray;">Q8</span> How confident are you about your answer to the previous question?</span>',
    //                 choices: [
    //                   ['1', 'Not confident at all'],
    //                   ['2', 'Not very confident'],
    //                   ['3', 'Neutral'],
    //                   ['4', 'Quite confident'],
    //                   ['5', 'Completely confident']
    //                 ],
    //                 shuffleChoices: false,
    //                 requiredChoice: true,
    //             });
    //             return false;
    //         }
    //
    //         return w.getValues();
    //     }
    // });
    //
    // ////////////////////////////////////////////////////////////////////////////////
    // // PRIOR LYL
    //     stager.extendStep('Part2_Prior_LYL_Nicaragua', {
    //         name: 'Part 2',
    //         frame: 'prior_LYL.htm',
    //         donebutton: true,
    //         cb: function() {
    //             //node.get('districtData', function(data) {
    //
    //             node.game.Q_impact = node.widgets.append('ChoiceManager', "T_impact", {
    //                     id: 'T_impact_q',
    //                     simplify: true,
    //                     panel: false,
    //                     forms: [
    //                       {
    //                         id: 'LYL_prior_Nicaragua',
    //                         mainText: '<span style="font-weight: normal;color:gray;">Q7</span> How many years of life do people living in <span style="color:#ee6933;">Nicaragua</span>, a ' +
    //                         'country in Central America, lose on average because of air pollution?<br>' +
    //                         '<span style="color:gray;font-weight: normal">(Move the slider to the desired position.)</span><br><br><br>',
    //                         hint: false,
    //                         name: 'Slider',
    //                         hidden: false,
    //                         requiredChoice: true,
    //                         initialValue: 0,
    //                         min: 0,
    //                         max: 120,
    //                         left: '0 years',
    //                         right: '12 years',
    //                         displayNoChange: false,
    //                         type: 'flat',
    //                         panel: false,
    //                         texts: {
    //                             currentValue: function(widget, value) {
    //                                 let LYL = [
    //                                     '0', '0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8', '0.9',
    //                                     '1.0', '1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8', '1.9',
    //                                     '2.0', '2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7', '2.8', '2.9',
    //                                     '3.0', '3.1', '3.2', '3.3', '3.4', '3.5', '3.6', '3.7', '3.8', '3.9',
    //                                     '4.0', '4.1', '4.2', '4.3', '4.4', '4.5', '4.6', '4.7', '4.8', '4.9',
    //                                     '5.0', '5.1', '5.2', '5.3', '5.4', '5.5', '5.6', '5.7', '5.8', '5.9',
    //                                     '6.0', '6.1', '6.2', '6.3', '6.4', '6.5', '6.6', '6.7', '6.8', '6.9',
    //                                     '7.0', '7.1', '7.2', '7.3', '7.4', '7.5', '7.6', '7.7', '7.8', '7.9',
    //                                     '8.0', '8.1', '8.2', '8.3', '8.4', '8.5', '8.6', '8.7', '8.8', '8.9',
    //                                     '9.0', '9.1', '9.2', '9.3', '9.4', '9.5', '9.6', '9.7', '9.8', '9.9',
    //                                     '10.0', '10.1', '10.2', '10.3', '10.4', '10.5', '10.6', '10.7', '10.8', '10.9',
    //                                     '11.0', '11.1', '11.2', '11.3', '11.4', '11.5', '11.6', '11.7', '11.8', '11.9',
    //                                     '12'
    //                                 ];
    //                                 node.game.contributionAmount = LYL[(value)];
    //                                 let myAnswer = LYL[(value)];
    //                                 let stringAnswer = String(myAnswer);
    //                                 let coloredAnswer = stringAnswer.fontcolor("#ee6933");
    //                                 return '<span style=\'font-size:20px;\'>You think people living in Nicaragua' +
    //                                 ' lose on average ' + coloredAnswer + ' years of life due to air pollution.</span>';
    //                             }
    //                           }
    //                       },
    //                     ]
    //                 });
    //
    //                 //W.show('data', 'flex');
    //                 //node.game.doneButton.enable();
    //             //});
    //         },
    //         done: function() {
    //             //var w, q1, q2;
    //             var w, q2;
    //
    //             w = node.game.Q_impact;
    //
    //             // DISPLAY 1
    //             //q1 = w.formsById.LYL_prior_Austria;
    //             //if (q1.isHidden()) {
    //               //  q1.reset(); // removes error.
    //               //  q1.show();
    //             //    return false;
    //             //}
    //
    //             // DISPLAY 2
    //             q2 = w.formsById.T_confident_decoy;
    //             if (!q2) {
    //                 node.widgets.last.addForm({
    //                     id: 'T_confident_decoy',
    //                     orientation: 'H',
    //                     mainText: '<span style="font-weight: normal;color:gray;">Q8</span> How confident are you about your answer to the previous question?</span>',
    //                     choices: [
    //                       ['1', 'Not confident at all'],
    //                       ['2', 'Not very confident'],
    //                       ['3', 'Neutral'],
    //                       ['4', 'Quite confident'],
    //                       ['5', 'Completely confident']
    //                     ],
    //                     shuffleChoices: false,
    //                     requiredChoice: true,
    //                 });
    //                 return false;
    //             }
    //
    //             return w.getValues();
    //         }
    //     });




    //////////////////////////////////////////////////////////////////////////
    // LEAFLET P3
    stager.extendStep('Part2_Air_pollution_damages_your_health', {
        name: 'Part 2',
        frame: 'leaflet_p3.htm',
        widget: {
            name: 'ChoiceManager',
            id: 'P3_q',
            options: {
                simplify: true,
                mainText: 'Based on the box above, find the correct answer to the questions below.<br>',
                forms: [
                    {
                        id: 'P3_q1',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q9</span> Which of the following health conditions are caused by exposure to air pollution?<br>',
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
    // LEAFLET Protection measures ALL
    stager.extendStep('Part2_Protection_measures', {
        name: 'Part 2',
        frame: 'leaflet_protection.htm',
        cb: function() {
                  //console.log(data);
            node.game.leafProt = node.widgets.append('ChoiceManager', "container", {
                id: 'leafProt',
                simplify: true,
                panel: false,
                forms: [
                        {
                            id: 'P4_q',
                            orientation: 'H',
                            mainText: '<span style="font-weight: normal;color:gray;">Q10</span> Which of the following two sentences is correct?*<br>',
                            choices: ["There is <b>nothing</b> I can do to protect myself effectively against air pollution.",
                          "There are <b>many things</b> I can do to protect myself effectively against air pollution, both indoors and outdoors."],
                            correctChoice: 1
                        }
                    ]
        });
        W.show('data', 'flex');
        node.game.doneButton.enable();
    },
    done: function() {
        var w, q2;

        w = node.game.leafProt;

                    // DISPLAY 1
      //   q1 = w.formsById.LYL_prior;
      //   if (q1.isHidden()) {
      //   q1.reset(); // removes error.
      //   q1.show();
      //   return false;
      // }

                    // DISPLAY 2
                    q2 = w.formsById.P4_T_q4;
                    if (!q2) {
                        node.widgets.last.addForm({
                          name: 'Feedback',
                          id: 'P4_T_q4',
                          mainText: '<span style="font-weight: normal;color:gray;">Q10b</span> Which actions can you take to protect yourself against air pollution outdoors and which actions can you take indoors? Summarize below.',
                          requiredChoice: true,
                          showSubmit: false,
                          minChars: 20,
                        });
                        return false;
                    }

                    return w.getValues();
                }
            });

    //////////////////////////////////////////////////////////////////////////
    // LEAFLET Protection measures Treatment
    // stager.extendStep('Part2_Protection_measures_T', {
    //     name: 'Part 2: Reading and comprehension',
    //     frame: 'leaflet_protection_T.htm',
    //     widget: {
    //         name: 'ChoiceManager',
    //         id: 'P4_T_q',
    //         options: {
    //             simplify: true,
    //             mainText: 'Now, we are interested in <b>your opinion</b>.',
    //             forms: [
    //                 {
    //                     id: 'P4_T_q2',
    //                     orientation: 'H',
    //                     mainText: '<span style="font-weight: normal;color:gray;">Q10a</span> Which protective measure(s) from the leaflet above are the MOST CONVENIENT for you to implement?<br>',
    //                     hint: '<span style="color:gray;font-size:14px;">(Select at least 1.)</span>',
    //                     // Number of choices per row/column.
    //                     choicesSetSize: 4,
    //                     choices: [
    //                       ['1', '<div class="aligned"><img src="face_mask.png" width="140px"><span>'],
    //                       ['2', '<div class="aligned"><img src="no_exercise.png" width="140px"><span>'],
    //                       ['3', '<div class="aligned"><img src="no_congested.png" width="140px"><span>'],
    //                       ['4', '<div class="aligned"><img src="nature.png" width="120px"><span>'],
    //                       ['5', '<div class="aligned"><img src="no_dust.png" width="140px"><span>'],
    //                       ['6', '<div class="aligned"><img src="AP.png" width="140px"><span>'],
    //                       ['7', '<div class="aligned"><img src="clean_fuels.png" width="120px"><span>'],
    //                       ['8', '<div class="aligned"><img src="ventilate.png" width="140px"><span>']],
    //                     // choices: ["Wear a face mask", "Avoid exercising outdoors in congested areas",
    //                     // "Check the air quality and avoid congested areas", "Spend time in nature",
    //                     // "Remove dust often", "Use an air purifier", "Use clean cooking and heating fuels", "Ventilate well the kitchen"],
    //                     selectMultiple: true,
    //                     shuffleChoices: false
    //                 },
    //                 {
    //                     id: 'P4_T_q3',
    //                     orientation: 'V',
    //                     mainText: '<div class="aligned"><img src="Leaflet_images/exclamation-mark.png" width="40px"><span> Read again the leaflet above.' +
    //                     ' You will be asked to summarize it on the next page.<br><br>' +
    //                     'What task will you be required to do on the next page?',
    //                     choices: [
    //                       ['1', 'Summarize the leaflet.'],
    //                       ['2', 'Do a task unrelated to the leaflet.']],
    //                     correctChoice: 0,
    //                 }
    //             ]
    //         },
    //     },
    // });

    ////////////////////////////////////////////////////////////////////////
    //LEAFLET Protection measures Treatment



    //////////////////////////////////////////////////////////////////////////
    // Instruction info acquisition
    stager.extendStep('Part2_Info_Choice', {
        name: 'Part 2',
        frame: 'info_choice.htm',
    });


    //////////////////////////////////////////////////////////////////////////

    // Region of CHOICE (Austria)
    stager.extendStep('Part2_Info_Choice_Decision', {
        name: 'Part 2',
        frame: 'choice_region.htm',
        donebutton: false,
        cb: function() {
            node.get('districtData', function(data) {

                //console.log(data);
                W.setInnerHTML('state', data.state);
                W.setInnerHTML('district', data.district);
                let myDistrict = data.district;
                let stringDistrict = String(myDistrict);
                let coloredDistrict = stringDistrict.fontcolor("#ee6933");
                let bcoloredDistrict = coloredDistrict.bold();

                node.game.RegionC = node.widgets.append('ChoiceManager', "RegionOfChoice", {
                    id: 'PC_q',
                    // ref: 'controlQuestions',
                    mainText: '',
                    // '<img src="choice.png" width="100px"> <span style="font-weight: bold;font-size:24px;color:#5c30af;">What do you want to read about next?</span><br/><br/>' +
                    //'You now have the opportunity to receive information about <b>air pollution levels</b> and the <b>number of life years lost ' +
                    //'because of air pollution</b> in a specific region. <br> <br>' +
                    //'In the next screen, You will be asked to <b><span style="font-size:25px;color:#ee6933;">indicate which of two regions</span></b> you prefer to read about. ' +
                    //'<br> <br> <b><u>How will your choice be implemented?</u></b> <br> <br>' +
                    //'The computer program will draw a ball from a virtual urn containing 6 <span style="fontcolor:green">green</span> balls and 4 <span style="fontcolor:red">red</span> balls.' +
                    //'<br> <br><img src="dices.png" width="40px"> However, your selection will only be implemented with a <b>60% probability</b>.<br> With a 40% probability, we will show you information on the other option.<br> <br>',
                    simplify: true,
                    forms: [
                      {
                          id: 'PC_q1_choice',
                          orientation: 'V',
                          mainText: '<span style="font-size:30px;"><span style="font-weight: normal;color:gray;">Q11</span> What do you prefer?</span>',
                         // hint: '<span style="color:gray;font-size:14px;">(Attention: Your choice will be implemented with a 60% probability.)</span>',
                          choices: [
                            ['home', 'I prefer to receive information about how much shorter my life is expected to be due to air pollution in ' + bcoloredDistrict  + ' (' + data.state + ').'],
                            ['nothing', 'I prefer not to receive any information.']
                            //['nothing', 'I prefer to <b>not</b> receive information about the number of life years lost due to air pollution in ' + bcoloredDistrict  + ' (' + data.state + ').']
                            // ['home', "<span style="font-size:25px;color:#ee6933;">" + data.district + '</span>' + ' (' + data.state + ')'],
                            // ['decoy', "<span style="font-size:25px;color:#ee6933;">Austria</span> (a country in central Europe)"]
                          ],
                          requiredChoice: true,
                          shuffleChoices: true
                      }
                    ]
                });

                W.show('data', 'flex');
                node.game.doneButton.enable();
            });
        },
        done: function() {
            return node.game.RegionC.getValues();
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Region of CHOICE (Nicaragua)
    // stager.extendStep('Part2_Info_Choice_Nicaragua', {
    //     name: 'Part 2: Reading and comprehension',
    //     frame: 'choice_region.htm',
    //     donebutton: false,
    //     cb: function() {
    //         node.get('districtData', function(data) {
    //
    //             //console.log(data);
    //             W.setInnerHTML('state', data.state);
    //             W.setInnerHTML('district', data.district);
    //             let myDistrict = data.district;
    //             let stringDistrict = String(myDistrict);
    //             let coloredDistrict = stringDistrict.fontcolor("#ee6933");
    //             let bcoloredDistrict = coloredDistrict.bold();
    //
    //             node.game.RegionC = node.widgets.append('ChoiceManager', "RegionOfChoice", {
    //                 id: 'PC_q',
    //                 // ref: 'controlQuestions',
    //                 mainText: '',
    //                 // '<img src="choice.png" width="100px"> <span style="font-weight: bold;font-size:24px;color:#5c30af;">What do you want to read about next?</span><br/><br/>' +
    //                 //'On the next page, you will receive information about the <b>number of life years lost ' +
    //                 //'because of air pollution</b> in a specific region. <br> <br>' +
    //                 //'You now have the opportunity to <b><span style="font-size:25px;color:#ee6933;">indicate which of two regions</span></b> you prefer to read about. ' +
    //                 //'<br> <br><img src="dices.png" width="40px"> However, your preferred option will be implemented with a <b>60% chance</b>.<br><br>',
    //                 // <br> With a 40% probability, we will show you information on the other option.<br> <br>',
    //                 simplify: true,
    //                 forms: [
    //                   {
    //                       id: 'PC_q1_nicaragua',
    //                       orientation: 'V',
    //                       mainText: '<span style="font-size:30px;"><span style="font-weight: normal;color:gray;">Q11</span> What do you prefer?</span>',
    //                       choices: [
    //                         ['home', 'I prefer to receive information about the number of life years lost due to air pollution in ' + bcoloredDistrict  + ' (' + data.state + ').'],
    //                         ['decoy', 'I prefer to receive information about the number of life years lost due to air pollution in <span style="color:#ee6933;"><b>Nicaragua</b></span> (a country in Central America).']
    //                       ],
    //                       requiredChoice: true,
    //                       shuffleChoices: true
    //                   }
    //                 ]
    //                 // formsOptions: {
    //                 //     requiredChoice: true
    //                 // }
    //             });
    //             W.show('data', 'flex');
    //             node.game.doneButton.enable();
    //         });
    //     },
    //     done: function() {
    //         return node.game.RegionC.getValues();
    //     }
    // });

    ////////////////////////////////////////////////////////////////////////////
    stager.extendStep('Part2_choice_outcome', {
        name: 'Part 2',
        frame: 'choice_outcome.htm',
        //donebutton: false,
        cb: function() {
            node.get('districtData2', function(data) {
                W.hide('ball_green')
                W.hide('ball_red')
                W.hide('home')
                W.hide('none')

                if (data.ball === 'green') {
                    //W.setInnerHTML('ball', "The computer drew a green ball. Your preferred choice was implemented");
                    W.show('ball_green')
                }
                else {
                    W.show('ball_red')
                    //W.setInnerHTML('ball', "The computer drew a red ball. Your preferred choice was not implemented");
                }

                if (data.chosen === 'nothing') {
                    W.show('none')
                    //W.setInnerHTML('choice', data.row.district);
                    //W.setInnerHTML('where', ", your home district");
                    //W.setInnerHTML('operator', "<b>not</b> receive")
                    node.game.choice_outcome = 'nothing';
                }
                else {
                    W.show('home')
                    W.setInnerHTML('choice', data.row.district);
                    W.setInnerHTML('where', ", your county");
                    //W.setInnerHTML('operator', "receive")
                    node.game.choice_outcome = 'home';
                }
                W.show('data', 'flex');
            });
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Pollution in your district
    stager.extendStep('Part2_Pollution_in_your_district', {
        name: 'Part 2',
        frame: 'leaflet_p5.htm',
        //donebutton: false,
        cb: function() {
            if (node.game.choice_outcome === 'nothing') {
              node.done();
            }
            else {
            node.get('districtData', function(data) {
                    var state_fig = data.state.replace(/ /g, '_');
                    state_fig = state_fig.replace(/&/g, 'and');
                    state_fig = state_fig.replace(/-/g, '_');

                    var district_fig = data.district.replace(/ /g, '_');
                    district_fig = district_fig.replace(/&/g, 'and');
                    district_fig = district_fig.replace(/-/g, '_');

                    //console.log(data);
                    W.setInnerHTML('district', data.district);
                    W.setInnerHTML('districtAgain', data.district);
                    W.setInnerHTML('districtAgainAgain', data.district);
                    W.setInnerHTML('districtAgainAgainAgain', data.district);
                    W.setInnerHTML('pm25', data.pm25.toFixed(2));
                    W.setInnerHTML('higher', (data.pm25 / 5).toFixed(1));
                    W.setInnerHTML('years', data.life_lost.toFixed(1));

                    W.gid('img').src = 'district_maps/' + state_fig + '_' + district_fig + '.png';
                    W.gid('L5').src = "Leaflet_images/L5_district.png";
                    // W.gid('banner').src = "Leaflet_images/banner_PM25_comp.png";



                    // node.game.controlQuestions = node.widgets.append('ChoiceManager', "ComprehquestionsL5", {
                    //     id: 'p5_q_home',
                    //     // ref: 'controlQuestions',
                    //     mainText: 'Based on the information provided above, find the correct answer to the question below.',
                    //     simplify: true,
                    //     forms: [
                    //         {
                    //             id: 'p5_q1_home',
                    //             orientation: 'H',
                    //             mainText: '<span style="font-weight: normal;color:gray;">Q12</span> On average, how many years of life does a person living in your district lose because of air pollution?<br>',
                    //             choices: [
                    //                 (data.row.life_lost * 0.5).toFixed(1) + ' years',
                    //                 (data.row.life_lost * 0.8).toFixed(1) + ' years',
                    //                 data.row.life_lost.toFixed(1) + ' years',
                    //                 (data.row.life_lost * 1.2).toFixed(1) + ' years',
                    //                 (data.row.life_lost * 1.5).toFixed(1) + ' years'
                    //             ],
                    //             correctChoice: 2,
                    //         }
                    //     ]
                    // });
                // W.show('data', 'flex');
                // node.game.doneButton.enable();
            });
          }
        },
        // done: function() {
        //     return node.game.controlQuestions.getValues();
        // }
    });



    ///////////////////////////////////////////////////////////////////
        // Explanation of counting task
        stager.extendStep('Part_3_Instructions', {
            name: 'Part 3',
            frame: 'instructions_filler_task.htm',
            cb: function() {
                W.setInnerHTML('bonus', node.game.settings.TASK_2_BONUS);
            }
        });


        /////////////////////////////////////////////////////////////////////////
        // Effort task - Counting zeros
        stager.extendStep('Part_3_Filler_Task', {
            name: 'Part 3',
            donebutton: false,
            frame: 'effort.html',
            done: function() {
                return { effort_count: node.game.correct };
            },
            init: function() {
                this.visualTimer = node.widgets.append('VisualTimer', W.getHeader());
            },
            exit: function() {
                if (node.game.visualTimer) {
                    node.game.visualTimer.destroy();
                    node.game.visualTimer = null;
                }
            },
            cb: function() {
                var box = W.gid('box');
                // variable to count correct answer
                var correct = 0;
                node.game.correct = correct;


                //show effort task
                // Number of numbers for each line
                var n = 12;
                // Number of lines
                var m = 4;
                // Initialize count of zeros
                var zeros = 0;

                // var Z = '<img src="effort_imgs/0.png" title="zero" name="zero" style="width: 30px"/>';
                var Z = '<img src="effort_imgs/bitcoin-gold-logo.png" title="one" name="one" style="width: 30px"/>';

                var O = '<img src="effort_imgs/1.png" title="one" name="one" style="width: 30px"/>';

                function genrand(n,m) {
                    box.innerHTML = '';
                    zeros = 0;
                    // Build a multidimensional array
                    for (var i = 0; i < m; i++) {
                        // Generate random sequence
                        var rand = Array(n).fill().map(() => Math.floor(Math.random()*2));
                        // Add div
                        var myDiv = document.createElement("div");
                        // Add the sequence to div

                        // Makes numbers as TEXT.
                        // myDiv.innerHTML = rand.join(' ');

                        // Display sequence
                        box.appendChild(myDiv);

                        // number of zeros
                        for (var j = 0; j < n; j++) {
                            if (rand[j] === 0) {
                                myDiv.innerHTML += Z;
                                zeros += 1;
                            }
                            else {
                                myDiv.innerHTML += O;
                            }
                        }
                    }

                    if (!node.game.zero) {
                        node.game.zero = node.widgets.append('CustomInput', 'input-div', {
                            id: 'zero',
                            mainText: 'How many coins are there?',
                            type: 'int',
                            min: 0,
                            max: 60,
                            requiredChoice: true
                        });
                    }
                    else {
                        node.game.zero.reset();
                    }
                }

                genrand(n,m);

                var button;
                button = W.gid('submitAnswer');
                button.onclick = function() {
                    var count = node.game.zero.getValues().value;
                    var message1;
                    var message2;
                    if (count === zeros) {
                        message1 = 'The answer is <strong>correct.</strong>';
                        node.game.correct += 1;
                        message2='So far, you had '+ node.game.correct+ ' correct tables.';
                    }
                    else {
                        message1 = 'The answer is <string>wrong.</strong>';
                        message2 = 'So far, you had '+ node.game.correct+ ' correct tables.';
                    }
                    //                alert(message);
                    // Hide element with id above.
                    // Show element with id results.
                    // Set innerHTML property of element with id textresult to
                    // the value correct or wrong and how many table done so far.

                    // hint: W.show and W.hide
                    W.hide('above');
                    W.show('results');
                    W.setInnerHTML('CheckAnswer', message1);
                    W.setInnerHTML('TotalPoint', message2);
                    genrand(n,m);
                };

                var button2;
                button2 = W.gid('nextTable');
                button2.onclick = function() {
                    // if (node.game.correct === 2) {
                    //     node.game.zero.destroy();
                    //     node.done();
                    //     return;
                    // }
                    // Hide element with id results.
                    // Show element with id above.
                    W.hide('results');
                    W.show('above');
                }
            },
        });

        stager.extendStep('Part_3_Results', {
            name: 'Part 3 - Your results',
            frame: 'effort_results.htm',
            cb: function() {
                var effort_payoff;
                effort_payoff = node.game.correct * node.game.settings.TASK_2_BONUS;
                effort_payoff = effort_payoff.toFixed(2);
                W.setInnerHTML('bonus', node.game.settings.TASK_2_BONUS);
                W.setInnerHTML('correct', node.game.correct);
                W.setInnerHTML('payoff', effort_payoff);
            },
            done: function() {
                console.log(node.game.choice_outcome);
                if (node.game.choice_outcome === 'nothing') {
                    node.game.gotoStep('Part4.Part4_LOC1');
                    return false; // prevent to make current step DONE.
                }
                else {
                console.log('I dont skip anything!');
              }
            }
        });


        ////////////////////////////////////////////////////////////////////////////////
        // Posterior LYL
        stager.extendStep('Part4_Posterior_LYL', {
            name: 'Part 4',
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
                                            return '<span style=\'font-size:20px;\'>You think people living in ' +
                                            data.district + ' lose on average ' + coloredAnswer + ' years of life due to air pollution.</span>';
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

                node.game.gueeBonus = 0;

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



////////////////////////////////////////////////////////////////////////////////
    // PART 4

    // LOCUS of CONTROL 1
        stager.extendStep('Part4_LOC1', {
            name: "Part 4",
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
                name: "Part 4",
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
                    name: "Part 4",
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
                        name: "Part 4",
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



        ////////////////////////////////////////////////////////////////////////////
        // FEEDBACK
        stager.extendStep('feedback', {
            widget: {
                name: 'Feedback',
                options: {
                    title: false,
                    panel: false,
                    minChars: 5,
                    showSubmit: false,
                    //requiredChoice: true,
                    mainText: 'Thank you for participating. ' +
                    '<br><br>' +
                    "If you want to get in touch with us for questions or suggestions, " +
                    "please write us an email at <em><span style='color:#bf2b42'>academic.research.India@gmail.com</span></em>." +
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
                    "If you do not have any comment, just type 'nothing' in the box below."
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
                      //' <b>Reminder: We will post another HIT with a follow-up survey in 2 weeks!<b>'
                  },
              }
          },
          init: function() {
              node.game.doneButton.destroy();
              node.say('end');
          }
      });
  };
