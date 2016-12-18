var knowt={};

knowt.begin = function() {
	//Initialize Web Audio API with all of our pieces
	knowt.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	knowt.gain = knowt.audioCtx.createGain();
	//Connect WAAPI nodes
	knowt.gain.gain.value=0.5;
	knowt.gain.connect(knowt.audioCtx.destination);
	//knowt.buildOsc();
	//Create links to HTML
	knowt.displayName = document.getElementById('note-name');
	knowt.displayOctave = document.getElementById('note-octave');
	knowt.displayHz = document.getElementById('note-hz');
	knowt.background = document.getElementById('background');

	knowt.update(knowt.randomPitch());
}

knowt.update = function(pitch) {
	pitch = pitch || knowt.randomPitch();
	console.log(pitch);

	var freq = knowt.calculateFreq(pitch);
	knowt.buildOsc(freq);

	var name = knowt.numberToPitchName(pitch);

	knowt.displayName.innerHTML = name.name;
	knowt.displayOctave.innerHTML = 'OCTAVE: ' + name.octave;
	knowt.displayHz.innerHTML = freq.toFixed(2) + ' Hz';
	knowt.background.style.background = knowt.synesthesia[name.name];
	setTimeout(knowt.update, 1000);
}

//calculating note pitch
knowt.calculateFreq = function(pitch) {
	var a4=440, //in hz
			mult=1.059463094359, //12th root of 2
			n=pitch-57; //in half-steps away from a4, which is note 57
	return a4 * (Math.pow(mult, n)); 
}

//C0=0, A4=57(?), etc...
knowt.numberToPitchName = function(n) {
	var pitch = n%12,
			octave = Math.floor(n/12),
			name = ['C','C#/Db','D','D#/Eb','E','F','F#/Gb','G','G#/Ab','A','A#/Bb','B'];
	console.log (name[pitch] + octave);
	return {name: name[pitch], octave: octave};
}

knowt.randomPitch = function(low,high) {
	var rng = Math.random();
	low = low || 30;
	high = high || 81;
	return Math.round( low + ( rng * ( high-low ) ) );
}

knowt.buildOsc = function(freq) {
	console.log ('note osc is a ' + knowt.osc);
	if (knowt.osc !==undefined) {knowt.osc.stop()};
	knowt.osc = knowt.audioCtx.createOscillator();
	knowt.osc.type='triangle';
	knowt.osc.connect(knowt.gain);
	knowt.osc.frequency.value = freq;
	knowt.osc.start();
}

knowt.synesthesia = {
	'C':'rgb(96,4,209)',
	'C#/Db':'rgb(26,59,190)',
	'D':'rgb(4,84,71)',
	'D#/Eb':'rgb(13,134,6)',
	'E':'rgb(124,169,1)',
	'F':'rgb(219,189,1)',
	'F#/Gb':'rgb(248,102,23)',
	'G':'rgb(196,67,0)',
	'G#/Ab':'rgb(161,59,0)',
	'A':'rgb(195,18,0)',
	'A#/Bb':'rgb(158,1,73)',
	'B':'rgb(133,4,135)',
}
