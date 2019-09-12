/**
	@demo demo/index.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import 'd2l-colors/d2l-colors.js';
import 'd2l-icons/d2l-icon.js';
import 'd2l-icons/tier1-icons.js';
import { PaperCheckedElementBehavior } from '@polymer/paper-behaviors/paper-checked-element-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { setTouchAction } from '@polymer/polymer/lib/utils/gestures.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="d2l-switch">
	<template strip-whitespace="">
		<style>
			:host {
				display: inline-block;
				position: relative;

				--d2l-switch-padding: 8px;
				--d2l-switch-margin: 10px;
			}

			:host([disabled]) {
				pointer-events: none;
			}

			:host(:focus) {
				outline: none;
			}

			:host(:focus) .toggle-container {
				box-shadow: 0px 0px 0px 2px var(--d2l-color-celestine);
			}

			.toggle-bar {
				position: absolute;
				height: 100%;
				width: 60px;
				border-radius: 9px;
				pointer-events: none;
				transition: background-color linear .1s;
				background-color: var(--d2l-color-pressicus);
				box-shadow: inset 0 3px 0 0 rgba(0, 0, 0, 0.1);
				border: 1px solid var(--d2l-color-pressicus);
				box-sizing: border-box;
			}

			:host([checked]) .toggle-bar {
				border: 1px solid var(--d2l-color-titanius);
			}

			.toggle-button {
				position: absolute;
				top: 0;
				left: 0;
				height: 30px;
				width: 30px;
				border-radius: 8px;
				box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.6);
				transition: transform linear .08s, background-color linear .08s;
				will-change: transform;
				background-color: var(--d2l-color-gypsum);
				box-shadow: inset 0 3px 0 0 rgba(0, 0, 0, 0.1);
				border: solid 1px var(--d2l-color-pressicus);
				box-sizing: border-box;
			}

			.toggle-button.dragging {
				-webkit-transition: none;
				transition: none;
			}

			:host([checked]) .toggle-bar {
				opacity: 1.0;
				background-color: var(--d2l-color-white);
			}

			:host([checked]) .toggle-button {
				-webkit-transform: translate(30px, 0);
				transform: translate(30px, 0);
			}

			.toggle-container {
				display: inline-block;
				position: relative;
				width: 60px;
				height: 30px;
				margin: 4px 1px;
				cursor: pointer;
				border-radius: 9px;
			}

			.toggle-label {
				position: relative;
				display: inline-block;
				vertical-align: middle;
				padding-left: var(--d2l-switch-padding);
				pointer-events: none;
			}

			:host([label-right]) .toggle-label,
			:host(:dir(rtl)) .toggle-label {
				padding-left: 0;
				padding-right: var(--d2l-switch-padding);
			}

			:host(:dir(rtl)):host([label-right]) .toggle-label {
				padding-left: var(--d2l-switch-padding);
				padding-right: 0;
			}

			:host(:dir(rtl))[label-right] .toggle-label {
				padding-left: var(--d2l-switch-padding);
				padding-right: 0;
			}

			.check {
				position: absolute;
				color: var(--d2l-color-olivine);
				top: 4px;
				left: 4px;
				width: 22px;
				height: 22px;
			}

			.container {
				display: flex;
				align-items: center;
			}

			:host([label-right]) .container {
				flex-direction: row-reverse;
			}

			.toggle-label {
				font-size: 16px;
				margin-right: var(--d2l-switch-margin);
				color: var(--d2l-color-ferrite);
				font-weight: normal;

				@apply --d2l-switch-toggle-label;
			}

			:host([label-right]) .toggle-label,
			:host(:dir(rtl)) .toggle-label {
				margin-right: 0;
				margin-left: var(--d2l-switch-margin);

				@apply --d2l-switch-toggle-label-right;
			}

			:host(:dir(rtl)):host([label-right]) .toggle-label {
				margin-right: var(--d2l-switch-margin);
				margin-left: 0;

				@apply --d2l-switch-toggle-label;
			}

			:host(:dir(rtl))[label-right] .toggle-label {
				margin-right: var(--d2l-switch-margin);
				margin-left: 0;

				@apply --d2l-switch-toggle-label;
			}

			:host([checked]) .toggle-label {
				color: var(--d2l-color-olivine);
				font-weight: bold;

				@apply --d2l-switch-toggle-label-checked;
			}

			:host paper-ripple {
				display: none;
			}
		</style>

		<div class="container">
			<div class="toggle-label">
				<slot></slot>
			</div>
			<div class="toggle-container">
				<div id="toggleBar" class="toggle-bar"></div>
				<d2l-icon class="check" icon="d2l-tier1:check"></d2l-icon>
				<div id="toggleButton" class="toggle-button"></div>
			</div>
		</div>
	</template>


</dom-module>`;

document.head.appendChild($_documentContainer.content);
Polymer({
	is: 'd2l-switch',

	behaviors: [
		PaperCheckedElementBehavior
	],

	properties: {
		labelRight: {
			type: Boolean,
			reflectToAttribute: true
		}
	},

	ready: function() {
		this._boundOnTrack = this._ontrack.bind(this);
		this.setAttribute('role', 'button');
		this.setAttribute('aria-pressed', !!this.checked);
		this.setAttribute('tabindex', 0);
	},

	attached: function() {
		this.addEventListener('track', this._boundOnTrack);
		this.noink = true;
		afterNextRender(this, /* @this */ function() {
			setTouchAction(this, 'pan-y');
		});
	},

	detached: function() {
		this.removeEventListener('track', this._boundOnTrack);
	},

	_ontrack: function(event) {
		var track = event.detail;
		if (track.state === 'start') {
			this._trackStart(track);
		} else if (track.state === 'track') {
			this._trackMove(track);
		} else if (track.state === 'end') {
			this._trackEnd(track);
		}
	},

	_trackStart: function() {
		this._width = this.$.toggleBar.offsetWidth / 2;
		this._trackChecked = this.checked;
		this.$.toggleButton.classList.add('dragging');
	},

	_trackMove: function(track) {
		var dx = track.dx;
		this._x = Math.min(this._width,
			Math.max(0, this._trackChecked ? this._width + dx : dx));
		this.translate3d(this._x + 'px', 0, 0, this.$.toggleButton);
		this._userActivate(this._x > (this._width / 2));
	},

	_trackEnd: function() {
		this.$.toggleButton.classList.remove('dragging');
		this.transform('', this.$.toggleButton);
	}
});
