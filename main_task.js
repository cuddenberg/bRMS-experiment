/**
 *
 * trial for implementing repeated masked suppression
 *
 * Rapidly presenting mondrian rectangles as image either appears
 * on left or right with increasingly levels of opacity. Fixation cross at the center.
 * 
 *
 * Built off of bRMS paradigm developed (Abir & Hassin, 2020). 
 *
 * https://github.com/yanivabir/measuring_prioritization_experiment_code
 * https://github.com/ConsciousLab/jsPsychRmsPlugin
 *
 **/

// Parameters
var ITI = 1000,
  time_limit = 60 * (60 * 1000),
  stimAlphas = [0.3, 0.9, 6],
  unitSize = 8, //controls display size
  repetitions = 20,
  trialLength = 0, // 0 is no limit
  fade_in_time = 1,
  fade_out_time = 15,
  fade_out_length = 5;


var images = ['/static/images/social1.png',
  '/static/images/social2.png',
  '/static/images/social3.png',
  '/static/images/social4.png',
  '/static/images/social5.jpg',
  '/static/images/social6.jpg'
];


//Enter fullscreen//
var fullscreen = {
  type: 'fullscreen',
  fullscreen_mode: true,
  message: '<p>This study runs in fullscreen. To switch to full screen mode,\
   press the button below.</p>'
}

//** bRMS instructions *** https://git.io/JeFfi.//
var instruction_text = [{
  stimulus: ["<p>We will now continue to the main task.</p>\
    <p align='center'><i>Press the space bar to continue.</i></p>"],
  choices: [32]
},
{
  stimulus: ["<div class = 'center'><p>You will be presented with rapidly \
    changing patterns of rectangles. Through these rectangles, scenes of \
    social scenarios will appear. Your task will be to indicate the location of \
    the scenes, or any part of them, as soon as they appear.</p >\
    <p align='center'><i>Press the space bar to continue.</i></p></div > "],
  choices: [32]
},
{
  stimulus: ["<div class = 'center'><p>If the scene appeared in the right half \
    of the screen, press the right key. If the scene appeared in the left half \
    of the screen, press the left key.</p>\
    <p align='center'><i>Press the space bar to continue.</i></p></div>"],
  choices: [32]
},
{
  stimulus: ["<div class = 'center'><p>Please perform this task as accurately \
    and quickly as you can.</p>\
    <p align='center'><i>Press the space bar to continue.</i></p></div>"],
  choices: [32]
},
{
  stimulus: ["<div class = 'center'><p>During the task, please focus your gaze at\
     the plus sign in the middle.<br>Even though the scenes appear to the left\
      and right of the plus sign, it is important that you look at the plus \
      sign at all times.</p>\
      <p align='center'></i>Press the space bar to continue.</i></p></div>"],
  choices: [32]
},
{
  stimulus: ["<div class='center'><p>Place your fingers on the 'D' and 'K' keys, \
    and press either one of these keys to continue.</p></div>"],
  choices: [68, 75]
}
];

var instructions = {
  type: 'html-keyboard-response',
  timeline: instruction_text,
  timing_post_trial: 200
};


// Main block instructions//
var mainBlockText = [
  {
    stimulus: ["<div class = 'center'><p>During the task, please focus your gaze at\
   the plus sign in the middle.<br>Even though the scenes appear to the left\
    and right of the plus sign, it is important that you look at the plus \
    sign at all times.</p>\
    <p>Press either the 'D' or the 'K' keys to continue.</p></div>"],
    choices: [68, 75]
  }
]

var mainBlockIns = {
  type: 'html-keyboard-response',
  timeline: mainBlockText,
  timing_post_trial: 200
}

//bRMS block//
// Make stimuli for bRMS https://git.io/JeFfi.
var stimuli = [];

for (a = Math.log10(stimAlphas[0]); a <= Math.log10(stimAlphas[1]); a += (Math.log10(stimAlphas[1]) - Math.log10(stimAlphas[0])) / (stimAlphas[2] - 1)) {
  for (i = 1; i <= repetitions - 1; i++) {
    stimuli.push({
      type: "bRMS",
      stimulus: '../static/images/social' + i + '.png',
      data: {
        stimulus: 'social' + i,
        stimulus_type: 'normal',
        timing_response: trialLength,
        stimulus_alpha: Math.pow(10, a),
        timing_post_trial: 100,
        within_ITI: ITI - 100,
        fade_in_time: fade_in_time,
        fade_out_time: fade_out_time,
        fade_out_length: fade_out_length
      },
      stimulus_alpha: Math.pow(10, a),
      timing_post_trial: 100,
      within_ITI: ITI - 100,
      timing_response: trialLength,
      fade_in_time: fade_in_time,
      fade_out_time: fade_out_time,
      fade_out_length: fade_out_length
    });
    stimuli.push({
      type: "bRMS",
      stimulus: '../static/images/social' + i + '.png',
      data: {
        stimulus: "social" + i,
        stimulus_type: 'normal',
        timing_response: trialLength,
        stimulus_alpha: Math.pow(10, a),
        timing_post_trial: 100,
        within_ITI: ITI - 100,
        fade_in_time: fade_in_time,
        fade_out_time: fade_out_time,
        fade_out_length: fade_out_length
      },
      stimulus_alpha: Math.pow(10, a),
      timing_post_trial: 100,
      within_ITI: ITI - 100,
      timing_response: trialLength,
      fade_in_time: fade_in_time,
      fade_out_time: fade_out_time,
      fade_out_length: fade_out_length
    });
  }
}
//shuffle order of stimuli//
var stimuli = jsPsych.randomization.shuffle(stimuli);

//define BRMS experiment block//
var bRMS_block = {
  timeline: stimuli,
  visUnit: function () {
    return unitSize
  },
  on_finish: function () {
    var current_date = new Date();
    if ((current_date.getTime() - exp_start_time) > time_limit) {
      jsPsych.endCurrentTimeline();
    }
  }
};

// Organize blocks in timeline
var experiment_blocks = [];
experiment_blocks.push(fullscreen);
experiment_blocks.push(instructions);
experiment_blocks.push(mainBlockIns);
experiment_blocks.push(bRMS_block);

// Initiate experiment
var exp_start_time = 0;
var current_date = new Date();
jsPsych.init({
  timeline: experiment_blocks,
  fullscreen: true,
  on_finish: function () {
    jsPsych.data.getInteractionData().json();
  },
  preload_images: images,
  on_trial_start: function () {
    // Record start time of bRMS block
    if (exp_start_time == 0 && jsPsych.currentTrial().type == 'bRMS') {
      exp_start_time = current_date.getTime();
    }
  }
});
