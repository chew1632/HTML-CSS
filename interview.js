fs = require('fs');
// songs
imagine = ['c', 'cmaj7', 'f', 'am', 'dm', 'g', 'e7'];
somewhere_over_the_rainbow = ['c', 'em', 'f', 'g', 'am'];
tooManyCooks = ['c', 'g', 'f'];
iWillFollowYouIntoTheDark = ['f', 'dm', 'bb', 'c', 'a', 'bbm'];
babyOneMoreTime = ['cm', 'g', 'bb', 'eb', 'fm', 'ab'];
creep = ['g', 'gsus4', 'b', 'bsus4', 'c', 'cmsus4', 'cm6'];
army = ['ab', 'ebm7', 'dbadd9', 'fm7', 'bbm', 'abmaj7', 'ebm'];
paperBag = ['bm7', 'e', 'c', 'g', 'b7', 'f', 'em', 'a', 'cmaj7', 'em7', 'a7', 'f7', 'b'];
toxic = ['cm', 'eb', 'g', 'cdim', 'eb7', 'd7', 'db7', 'ab', 'gmaj7', 'g7'];
bulletproof = ['d#m', 'g#', 'b', 'f#', 'g#m', 'c#'];
// song_11 = [];
var songs = [];
var labels = [];
var allChords = [];
var labelCounts = [];
var labelProbabilities = []; // 0.33333 0.33333 0.33333 0.33333
var plus = 1.01;
var chordCountsInLabels = {};
var probabilityOfChordsInLabels = {};

function train(chords, label) {
    // push 進 songs total 9 筆
    songs.push([label, chords]);
    // push 進 labels [easy , medium , hard]
    labels.push(label);
    // push 進 allChords [判斷裡面有過的chord不會再進去]
    for (var i = 0; i < chords.length; i++) {
        if (!allChords.includes(chords[i])) {
            allChords.push(chords[i]);
        }
    }
    // labelCounts [easy:3, medium:3, hard:3]
    if (!!(Object.keys(labelCounts).includes(label))) {
        labelCounts[label] = labelCounts[label] + 1;
    } else {
        labelCounts[label] = 1;
    }
};

function getNumberOfSongs() {
    return songs.length;
};

function setLabelProbabilities() {
    Object.keys(labelCounts).forEach(function (label) {
        var numberOfSongs = getNumberOfSongs();  //取得總共幾首歌
        labelProbabilities[label] = labelCounts[label] / numberOfSongs; //9首歌 ÷ 3
    });
};

function setChordCountsInLabels() {
    songs.forEach(function (i) {
        if (chordCountsInLabels[i[0]] === undefined) {
            chordCountsInLabels[i[0]] = {};
        }
        i[1].forEach(function (j) {
            if (chordCountsInLabels[i[0]][j] > 0) {
                console.log(chordCountsInLabels[i[0]]);
                chordCountsInLabels[i[0]][j] = chordCountsInLabels[i[0]][j] + 1;
            } else {
                chordCountsInLabels[i[0]][j] = 1;
            }
        });
    });
}
function setProbabilityOfChordsInLabels() {
    probabilityOfChordsInLabels = chordCountsInLabels;
    Object.keys(probabilityOfChordsInLabels).forEach(function (i) {
        Object.keys(probabilityOfChordsInLabels[i]).forEach(function (j) {
            probabilityOfChordsInLabels[i][j] = probabilityOfChordsInLabels[i][j] * 1.0 / songs.length;
        });
    });
}

train(imagine, 'easy');
train(somewhere_over_the_rainbow, 'easy');
train(tooManyCooks, 'easy');
train(iWillFollowYouIntoTheDark, 'medium');
train(babyOneMoreTime, 'medium');
train(creep, 'medium');
train(paperBag, 'hard');
train(toxic, 'hard');
train(bulletproof, 'hard');

setLabelProbabilities();
setChordCountsInLabels();
setProbabilityOfChordsInLabels();

function classify(chords) {
    var arrayOfLabelProbabilities = labelProbabilities;
    console.log(arrayOfLabelProbabilities);
    var classified = {};
    Object.keys(arrayOfLabelProbabilities).forEach(function (obj) {
        console.log("here");
        console.log(labelProbabilities[obj]);
        var labelProbabilitiesAddOne = labelProbabilities[obj] + 1.01;
        chords.forEach(function (chord) {
            var checkerProbabilityOfChordInLabel = probabilityOfChordsInLabels[obj, chord];
            if (checkerProbabilityOfChordInLabel === undefined) {
                labelProbabilitiesAddOne + plus;
            } else {
                labelProbabilitiesAddOne = labelProbabilitiesAddOne * (checkerProbabilityOfChordInLabel + plus);
            }
        });
        classified[obj] = labelProbabilitiesAddOne;
    });
    console.log(classified);
};
classify(['d', 'g', 'e', 'dm']);
classify(['f#m7', 'a', 'dadd9', 'dmaj7', 'bm', 'bm7', 'd', 'f#m']);
