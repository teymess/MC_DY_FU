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

    const redirectUrls = {
        completed: 'https://dkr1.ssisurveys.com/projects/end?rst=1&psid=',
        screenOut: 'https://dkr1.ssisurveys.com/projects/end?rst=2&psid=',
        //quotaFull: 'https://dkr1.ssisurveys.com/projects/end?rst=3&psid=',
    };

    const redirect = (id, action) => {
        // Build redirect url.
        //console.log('Arrived at redirect function');
        let url = redirectUrls[action];
        url = `${url}${id}`;

        if (action === 'completed') {
            url = `${url}&basic=30733`
        }

        let client = channel.registry.getClient(id);
        // // Check if there is demographic data.
        //let demoData = memory.demo_player.get(id);

        // Decrease quota if necessary. TODO: check condition.
        // if (action !== 'completed' && action !== 'reconnect' && demoData && !client.redirected) {
        //     console.log('Removing from quota...');
        //     setup.decreaseQuota(demoData);
        // }
        //
        // // Increase quota if necessary (on reconnect)
        // if (action === 'reconnect' && demoData) {
        //   console.log('Adding to quota...');
        //   setup.increaseQuota(demoData);
        // }

        // redirect if player was not redirected before
        if (action !== 'disconnect' && action !== 'reconnect' && !client.redirected) {

        // Mark player redirected.
        client.redirected = true;

        // Client cannot reconnect.
        client.allowReconnect = false;
        // Redirect.
            console.log('Redirecting...');
            console.log(id);
            setTimeout(() => node.redirect(url, id), 100);
        }
    };

    // Must implement the stages here.

    stager.setOnInit(function() {

      function diffMinutes(dt2, dt1) {
          let diff = (dt2 - dt1) / 1000;
          diff /= 60;
          return Math.abs(Math.round(diff));
      }

      setInterval(connectionCheck, 300000);

      function connectionCheck(msg) {
          let d = new Date().getTime();
          node.game.pl.forEach(p=> {
              let id = p.id;
              let client = channel.registry.getClient(id);
              let min = diffMinutes(client.connectTime.getTime(), d);
              if (min > 90) { // 90
                console.log("Sending to redirect funtion due to timeout...");
                redirect(id, "screenOut");
              }
              else {
                  console.log('Still time left!');
              }
          });
      }

        memory.stream();

        memory.view("consent").stream({ headerAdd: "consent" });

        memory.consent.on('insert', item => {
          if (item.consent === false) {
            console.log('Redirecting in 10 seconds!');
            let id = item.player;
            //console.log(item.player);
            //let url = `https://dkr1.ssisurveys.com/projects/end?rst=2&psid=${id}`;
            console.log("Sending to redirect funtion due to consent rejected...");
            setTimeout(() => redirect(id, "screenOut"), 10);
          }
        });

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

        memory.index('county_player', item => {
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

        node.on.pdisconnect(p => {
            //debugger
            let id = p.id;
            // if (!p.redirected) {
            //     // Decrease quota.
            //     setup.decreaseQuota(item);
            //     // Perhaps you want to use timers, to avoid that somebody
            //     // who disconnected and then reconnects has no place any more.
            // }
            console.log("Sending to redirect funtion due to disconnection...");
            redirect(id, "disconnect");
        });

        node.on.preconnect(p => {
            let id = p.id;
            // Decrease quota.
            console.log("Sending to redirect funtion due to reconnection...");
            redirect(id, "reconnect");
        });

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
                headerAdd: ["psid"],
                append: true,
                clients: [ id ]
            });
        });

        node.on('get.districts', function(msg) {
            let state = msg.data;
            return setup.counties[state];
        });

        node.on('get.districtData', function(msg) {

            let { state, county } = getStateCounty(msg.from);
            let countyIdx = setup.getCountyIdx(state, county);

            return setup.pollutionDb.county.get(countyIdx);
        });


        node.on('get.districtData2', function(msg) {

            let { state, county } = getStateCounty(msg.from);
            let countyIdx = setup.getCountyIdx(state, county);

            var choice = memory.choice_decision.get(msg.from);
            choice = choice.PC_q1_choice.value;
            console.log(choice);

            var random = Math.random();
            console.log(random);

            let row = setup.pollutionDb.county.get(countyIdx);

            if (choice === 'nothing' && random > 0.4) {
                return {
                    ball: "green",
                    chosen: "nothing",
                    row: row
                }
            }
            else if (choice === 'nothing' && random <= 0.4) {
                return {
                    ball: "red",
                    chosen: "home",
                    row: row
                }
            }
            else if (choice === 'home' && random > 0.4) {
                return {
                    ball: "green",
                    chosen: "home",
                    row: row
                }
            }
            else if (choice === 'home' && random <= 0.4) {
                return {
                    ball: "red",
                    chosen: "nothing",
                    row: row
                }
            }
        });
    });

    function getStateCounty(playerId) {
        let info = memory.county_player.get(playerId);
        console.log(info);
        let state = info.forms.state.value;
        let county = info.forms.district.value;
        return { state, county };
    }

    node.on.done('end', function(msg) {
            console.log('Redirecting');
            let id = msg.from;
            //let url = `https://dkr1.ssisurveys.com/projects/end?rst=1&psid=${id}&basic=78806`;
            console.log("Sending to redirect funtion due to completion...");
            redirect(id, "completed");
        });
};
