/**
* # Logic type implementation of the game stages
* Copyright(c) 2021 Anca Balietti <anca.balietti@gmail.com>
* MIT Licensed
*
* http://www.nodegame.org
* ---
*/

"use strict";

const ngc = require('nodegame-client');
const J = ngc.JSUS;

module.exports = function(treatmentName, settings, stager, setup, gameRoom) {

    let node = gameRoom.node;
    let channel = gameRoom.channel;
    let memory = node.game.memory;
    var random = Math.random();
    console.log(random);

    // Make the logic independent from players position in the game.
    stager.setDefaultStepRule(ngc.stepRules.SOLO);

    // Must implement the stages here.

    stager.setOnInit(function() {

        memory.stream();

        // Feedback.
        memory.view('feedback').stream({
            format: 'csv',
            header: [ 'time', 'timestamp', 'player', 'feedback' ]
        });

        // Email.
        memory.view('email').stream({
            format: 'csv',
            header: [ 'timestamp', 'player', 'email' ]
        });

        memory.index('district_player', item => {
            if (item.stepId === 'Part_1_q3') return item.player;
        });

        memory.index('income_decile', item => {
            if (item.stepId === 'Part_1_q4') return item.player;
        });

        memory.index('choice_austria', item => {
            if (item.stepId === 'Part2_Info_Choice_Austria') return item.player;
        });

        memory.index('choice_nicaragua', item => {
            if (item.stepId === 'Part2_Info_Choice_Nicaragua') return item.player;
        });

        node.on.data('done', function(msg) {

            let id = msg.from;
            let step = node.game.getStepId(msg.stage);

            if (step === 'memory_test1') {
                let bonus = msg.data.bonus;
                console.log(bonus);
                gameRoom.updateWin(id, bonus);
            }
            else if (step === 'memory_test2') {
                let bonus = msg.data.bonus;
                console.log(bonus);
                gameRoom.updateWin(id, bonus);
            }
            else if (step === 'memory_test3') {
                let bonus = msg.data.bonus;
                console.log(bonus);
                gameRoom.updateWin(id, bonus);
            }
            else if (step === 'memory_test4') {
                let bonus = msg.data.bonus;
                console.log(bonus);
                gameRoom.updateWin(id, bonus);
            }
            else if (step === 'memory_test5') {
                let bonus = msg.data.bonus;
                console.log(bonus);
                gameRoom.updateWin(id, bonus);
            }
            else if (step === 'memory_test6') {
                let bonus = msg.data.bonus;
                console.log(bonus);
                gameRoom.updateWin(id, bonus);
            }
            else if (step === 'memory_test7') {
                let bonus = msg.data.bonus;
                console.log(bonus);
                gameRoom.updateWin(id, bonus);
            }
            else if (step === 'memory_test8') {
                let bonus = msg.data.bonus;
                console.log(bonus);
                gameRoom.updateWin(id, bonus);
            }
            else if (step === 'memory_test9') {
                let bonus = msg.data.bonus;
                console.log(bonus);
                gameRoom.updateWin(id, bonus);
            }
            else if (step === 'memory_test10') {
                let bonus = msg.data.bonus;
                console.log(bonus);
                gameRoom.updateWin(id, bonus);
            }
            else if (step === 'memory_test11') {
                let bonus = msg.data.bonus;
                console.log(bonus);
                gameRoom.updateWin(id, bonus);
            }
            else if (step === 'memory_test12') {
                let bonus = msg.data.bonus;
                console.log(bonus);
                gameRoom.updateWin(id, bonus);
            }
            else if (step === 'memory_test13') {
                let bonus = msg.data.bonus;
                console.log(bonus);
                gameRoom.updateWin(id, bonus);
            }
            else if (step === 'memory_test14') {
                let bonus = msg.data.bonus;
                console.log(bonus);
                gameRoom.updateWin(id, bonus);
            }
            else if (step === 'memory_test15') {
                let bonus = msg.data.bonus;
                console.log(bonus);
                gameRoom.updateWin(id, bonus);
            }

            else if (step === 'Part_3_Filler_Task') {
                let bonus = msg.data.effort_count * settings.TASK_2_BONUS;
                gameRoom.updateWin(id, bonus);
            }

            else if (step === 'Part4_Posterior_LYL') {
                let bonus = msg.data.bonus;
                console.log(bonus);
                gameRoom.updateWin(id, bonus);
            }

            else if (step === 'feedback') {

                // Saves bonus file, and notifies player.
                //gameRoom.updateWin(id,settings.WIN);

                let db = memory.player[id];

                // Select all 'done' items and save its time.
                db.save('times.csv', {
                    header: [
                        'session', 'player', 'stage', 'step', 'round',
                        'time', 'timeup'
                    ],
                    append: true
                });

                db.save('survey.csv', {
                    header: 'all',
                    append: true,
                    flatten: true,
                    objectLevel: 3
                });
            }
        });

        node.on.data('end',function(message) {
            let id = message.from;
            gameRoom.computeBonus({
                append: true,
                clients: [ id ],
                amt: true
            });
        });

        node.on('get.districts', function(msg) {
            let state = msg.data;
            return setup.districts[state];
        });

        node.on('get.districtData', function(msg) {

            let district = memory.district_player.get(msg.from);

            //console.log(district);
            district = district.forms.district.value;

            return setup.pollutionDb.district.get(district)
        });


        node.on('get.districtData2', function(msg) {

            var district = memory.district_player.get(msg.from);
            //console.log(district);
            district = district.forms.district.value;

            if ((treatmentName === 'info_once_austria' || treatmentName === 'info_twice_austria')) {
                var choice_aus = memory.choice_austria.get(msg.from);

                //console.log(choice);
                choice_aus = choice_aus.PC_q1_austria.value;

                if ((choice_aus === 'decoy' && random > 0.4) || (choice_aus === 'home' && random <= 0.4)) {
                    return {
                        chosen: "Austria",
                        row: setup.pollutionDb.district.get(district)
                    }
                }
                else {
                    return {
                        chosen: "Home",
                        row: setup.pollutionDb.district.get(district)
                    }
                }
            }
            else if (treatmentName === 'info_once_nicaragua' || treatmentName === 'info_twice_nicaragua') {
                var choice_nic = memory.choice_nicaragua.get(msg.from);

                //console.log(choice);
                choice_nic = choice_nic.PC_q1_nicaragua.value;

                // let district = memory.district_player.get(msg.from);
                //
                // //console.log(district);
                // district = district.forms.district.value;

                if ((choice_nic === 'decoy' && random > 0.4) || (choice_nic === 'home' && random <= 0.4)) {
                    return {
                        chosen: "Nicaragua",
                        row: setup.pollutionDb.district.get(district)
                    }
                }
                else {
                    return {
                        chosen: "Home",
                        row: setup.pollutionDb.district.get(district)
                    }
                }
            }
        });
    });

    stager.setOnGameOver(function() {
        // Something to do.
    });
};
