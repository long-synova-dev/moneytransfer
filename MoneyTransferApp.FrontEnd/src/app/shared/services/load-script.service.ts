import {Injectable} from "@angular/core";
import * as $ from 'jquery';

declare let document: any;

interface Script {
	src: string;
	loaded: boolean;
}

@Injectable()
export class ScriptLoaderService {
	private _scripts: Script[] = [];
	private tag: any;
	private isLoaded: boolean = false;

	load(tag, ...scripts: string[]) {
		this.tag = tag;
		scripts.forEach((script: string) => this._scripts[script] = {src: script, loaded: false});

		let promises: any[] = [];
		scripts.forEach((script) => promises.push(this.loadScript(script)));
		return Promise.all(promises);
	}

	loadScript(src: string) {
		return new Promise((resolve, reject) => {

			//resolve if already loaded
			if (this._scripts[src].loaded) {
				resolve({script: src, loaded: true, status: 'Already Loaded'});
			}
			else {
				//load script
				let script = $('<script/>')
					.attr('type', 'text/javascript')
					.attr('src', this._scripts[src].src);

				$(this.tag).append(script);
				resolve({script: src, loaded: true, status: 'Loaded'});
			}
		});
	}

	loadGTagScript() {
		return new Promise((resolve, reject) => {
				//load script
				let script = $('<script/>')
					.attr('type', 'text/javascript')
					.append(`
						(function (w, d, s, l, i) {
							w[l] = w[l] || []; w[l].push({
								'gtm.start':
								new Date().getTime(), event: 'gtm.js'
							}); var f = d.getElementsByTagName(s)[0],
								j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src =
									'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
						})(window, document, 'script', 'dataLayer', 'GTM-MZ68MRD');
					`)
					// .attr('src', this._scripts[src].src);

				// $(this.tag).append(script);
				$('head').append(script);
				resolve({status: 'Loaded'});
		});
	}

}