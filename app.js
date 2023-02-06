//------------------------------------------------------------------------------------------
/* 
    app.js
    @date 2023 02 06
    @purpose Construct a general oscillator for interface playback.
*/
//------------------------------------------------------------------------------------------
"use strict";
//------------------------------------------------------------------------------------------
class Message {
	// Static variables for message on oscillator state.
	static warning = console.warn( "⚠️ no oscillator!" );
	static success = alert( "✅ oscillator live" );
	static wave_update = undefined;
}
//------------------------------------------------------------------------------------------
class Button {
	// Static variables to select play and stop buttons.
	static play = document.querySelector( "#playbutton" );
	static stop = document.querySelector( "#stopbutton" );
}
//------------------------------------------------------------------------------------------
class Oscillator {
	/* 
	    Class definition for the oscillator.

	    @param wave_type (string), type of wave — sine, sawtooth, triangle, etc.
	    @param frequency (float), frequency of the wave.
	    @param volume (float), this is the volume wave will play at.
	    ------------------------------------------------------------------------
	    @method build, returns the oscillator object — oscillator and context
	    @method start, connects and starts the oscillator.
	    @method stop, stops and disconnects the oscillator
	*/
	wave = { 
		sine: "sine", 
		square: "square", 
		triangle: "triangle", 
		saw: "saw" 
	}
	constructor( wave_type, frequency, volume ){
		this.wave_type = wave_type || this.wave.sine || this.wave.square;
		this.frequency = frequency;
		this.volume = volume;
		this.build = this.build( wave_type, frequency, volume );
	}
	build(){
		const audio_context = new AudioContext();
		let oscillator = audio_context.createOscillator();
		oscillator.type = this.wave_type;
		oscillator.frequency.value = this.frequency;
		oscillator.volume = this.volume;
		const oscillator_object = { 
			oscillator: oscillator, 
			context: audio_context 
		};
		return oscillator_object;
	}
	start(){
		this.build.oscillator.connect( this.build.context.destination );
		this.build.oscillator.start( this.build.context.currentTime );
	}
	stop(){
		this.build.oscillator.stop( this.build.context.currentTime );
		this.build.oscillator.disconnect( this.build.context.destination) ;
	}
}
//------------------------------------------------------------------------------------------
const oscillator = new Oscillator( "triangle", 66, 0.56 ); // init from instantiating the class.
//------------------------------------------------------------------------------------------
Button.play.addEventListener( 'mouseover', ()=>{ Button.play.innerHTML = 'Ready to play.' });
Button.play.addEventListener( 'mouseout', ()=>{ Button.play.innerHTML = 'Play'; });
Button.play.addEventListener( 'click', ()=>{
	const update_element = document.querySelector("#wave_update");
	Message.wave_update = `Playing a ${oscillator.wave_type} wave @ a frequency of ${oscillator.frequency} khz`;
	update_element.innerHTML = Message.wave_update;
	Button.play ? oscillator.start() : Message.warning;
	Button.stop.style.visibility = 'visible';
});
//------------------------------------------------------------------------------------------
Button.stop.addEventListener( 'mouseover', ()=>{ Button.stop.innerHTML = 'Okay to stop.' });
Button.stop.addEventListener( 'mouseout', ()=>{ Button.stop.innerHTML = 'Stop'; });
Button.stop.addEventListener( 'click', ()=>{
	Button.stop ? oscillator.stop() : Message.warning;
});
//------------------------------------------------------------------------------------------