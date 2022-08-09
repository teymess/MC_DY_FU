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

        memory.index('choice_decision', item => {
            if (item.stepId === 'Part2_Info_Choice_Decision') return item.player;
        });

        // memory.index('choice_nicaragua', item => {
        //     if (item.stepId === 'Part2_Info_Choice_Nicaragua') return item.player;
        // });

        node.on.data('done', function(msg) {

            let id = msg.from;
            let step = node.game.getStepId(msg.stage);

            if (step === 'memory_test1') {
                let bonus = msg.data.m1_bonus;
                console.log(bonus);
                gameRoom.updateWin(id, bonus);
            }
            else if (step === 'memory_test2') {
                let bonus = msg.data.m2_bonus;
                console.log(bonus);
                gameRoom.updateWin(id, bonus);
            }
            else if (step === 'memory_test3') {
                let bonus = msg.data.m3_bonus;
                console.log(bonus);
                gameRoom.updateWin(id, bonus);
            }
            else if (step === 'memory_test4') {
                let bonus = msg.data.m4_bonus;
                console.log(bonus);
                gameRoom.updateWin(id, bonus);
            }
            else if (step === 'memory_test5') {
                let bonus = msg.data.m5_bonus;
                console.log(bonus);
                gameRoom.updateWin(id, bonus);
            }
            else if (step === 'memory_test6') {
                let bonus = msg.data.m6_bonus;
                console.log(bonus);
                gameRoom.updateWin(id, bonus);
            }
            else if (step === 'memory_test7') {
                let bonus = msg.data.m7_bonus;
                console.log(bonus);
                gameRoom.updateWin(id, bonus);
            }
            else if (step === 'memory_test8') {
                let bonus = msg.data.m8_bonus;
                console.log(bonus);
                gameRoom.updateWin(id, bonus);
            }
            else if (step === 'memory_test9') {
                let bonus = msg.data.m9_bonus;
                console.log(bonus);
                gameRoom.updateWin(id, bonus);
            }
            else if (step === 'memory_test10') {
                let bonus = msg.data.m10_bonus;
                console.log(bonus);
                gameRoom.updateWin(id, bonus);
            }
            else if (step === 'memory_test11') {
                let bonus = msg.data.m11_bonus;
                console.log(bonus);
                gameRoom.updateWin(id, bonus);
            }
            else if (step === 'memory_test12') {
                let bonus = msg.data.m12_bonus;
                console.log(bonus);
                gameRoom.updateWin(id, bonus);
            }
            else if (step === 'memory_test13') {
                let bonus = msg.data.m13_bonus;
                console.log(bonus);
                gameRoom.updateWin(id, bonus);
            }
            else if (step === 'memory_test14') {
                let bonus = msg.data.m14_bonus;
                console.log(bonus);
                gameRoom.updateWin(id, bonus);
            }
            else if (step === 'memory_test15') {
                let bonus = msg.data.m15_bonus;
                console.log(bonus);
                gameRoom.updateWin(id, bonus);
            }

            else if (step === 'Part_1_q3') {
              let state = memory.district_player.get(msg.from);
              console.log(state);
              state = state.forms.state.value;

                if (state !== 'Texas') {
                    let clientObj = channel.registry.getClient(id);
                    clientObj.allowReconnect = false;
                    node.redirect('location_error.htm', id);
                }
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
            district = district.forms.district.value;

            var choice = memory.choice_decision.get(msg.from);
            choice = choice.PC_q1_choice.value;
            console.log(choice);

            var random = Math.random();
            console.log(random);

            if (choice === 'nothing' && random > 0.4) {
                return {
                    ball: "green",
                    chosen: "nothing",
                    row: setup.pollutionDb.district.get(district)
                }
            }
            else if (choice === 'nothing' && random <= 0.4) {
                return {
                    ball: "red",
                    chosen: "home",
                    row: setup.pollutionDb.district.get(district)
                }
            }
            else if (choice === 'home' && random > 0.4) {
                return {
                    ball: "green",
                    chosen: "home",
                    row: setup.pollutionDb.district.get(district)
                }
            }
            else if (choice === 'home' && random <= 0.4) {
                return {
                    ball: "red",
                    chosen: "nothing",
                    row: setup.pollutionDb.district.get(district)
                }
            }
        });
    });

    stager.setOnGameOver(function() {
        // Something to do.
    });
};
