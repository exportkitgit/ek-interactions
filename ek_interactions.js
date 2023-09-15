/*

                       0000                       
                  0000000000000                   
              0000000000000000000000              
         00000000000000000000000000000000         
    000000000000000000000000000000000000000000    
  000000000000000000000000000000000000000000000   
       000000000000000000000000000000000000       
00000       00000000000000000000000000       00000
000000000        0000000000000000        000000000
00000000000000        000000        00000000000000
0000000000000000000            0000000000000000000
00000000000000000000000   000000000000000000000000
000000000000000000000000  000000000000000000000000
00000000    000000000000  000000000000000000000000
00000000       000000000  000000000000000000000000
00000000  00000000000000  00000000000  00000000000
00000000  00000000000000  00000000000  00  0000000
00000000    000000000000  0000000000       0000000
00000000      0000000000  0000000       0000000000
00000000  00000000000000  00000000 00  00000000000
00000000  00000000000000  00000000000  00000000000
00000000   0000000000000  000000000000000000000000
00000000      0000000000  000000000000000000000000
0000000000000 0000000000  000000000000000000000000
000000000000000000000000  000000000000000000000000
   000000000000000000000  000000000000000000000   
        0000000000000000  0000000000000000        
             00000000000  00000000000             
                 0000000  000000                  
                      00  00                      

 
@author     Export Kit
@v1			22.07.25
@v2			23.09.14
@license    Free as air!
 
*/
var _ekIsInit = { overlay: false, navigation: false };
var _cache = { overlay: [], sates: [] };
var _overlay, _navigation, _id = 0;

document.onreadystatechange = () => {
  if (document.readyState === "interactive") {

	ek_ontimeout(document.body);

	if(window.location.protocol === 'file:') {

	    const alertDiv = document.createElement('div');
	    alertDiv.id = 'host-requirement-alert';
	    alertDiv.classList.add('alert');

	    const alertContentDiv = document.createElement('div');
	    alertContentDiv.classList.add('alert-content');

	    const closeBtnSpan = document.createElement('span');
	    closeBtnSpan.classList.add('close-btn');
	    closeBtnSpan.innerHTML = '&times;';
	    closeBtnSpan.addEventListener('click', closeAlert);

	    const alertMessage = document.createElement('p');
	    alertMessage.textContent = 'Some functionality requires a local or web host. Please run this application from a web server.';

	    alertContentDiv.appendChild(closeBtnSpan);
	    alertContentDiv.appendChild(alertMessage);
	    alertDiv.appendChild(alertContentDiv);

	    const styleElement = document.createElement('style');
	    styleElement.textContent = `
	      .alert {
	        position: fixed;
	        top: 0;
	        left: 0;
	        width: 100%;
	        height: 100%;
	        background-color: rgba(0, 0, 0, 0.7);
	        z-index: 1000;
	        justify-content: center;
	        align-items: center;
	      }

	      .alert-content {
	        background-color: white;
	        padding: 30px;
	        border-radius: 5px;
	        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
	        text-align: center;
	        position: relative;
	        display:table; 
	        position: absolute;
	        top: 50%;
	        left: 50%;
	        transform: translate(-50%,-50%);
	      }

	      .close-btn {
	        position: absolute;
	        top: 10px;
	        right: 10px;
	        cursor: pointer;
	        font-size: 20px;
	        font-weight: bold;
	      }
	    `;

	    document.body.appendChild(alertDiv);
	    document.head.appendChild(styleElement);
	}

	function closeAlert() {
	  	const alertDiv = document.getElementById('host-requirement-alert');
	  	if(alertDiv){ alertDiv.style.display = 'none'; }
	}

  
  }
};

function ek_ontimeout(dbody){
	[...dbody.querySelectorAll("*")].forEach( ele => {
		if(ele.hasAttribute('ontimeout')){
			let _timeout = ele.getAttribute('ontimeout');
			let _delay = ele.getAttribute('delay');
			setTimeout(fn => {
				eval('let event = {target:document.getElementById("'+ele.id+'")};'+_timeout);
			},_delay);
		}
		let attrList = ['onclick','onmouseover','onmouseup','onmousedown','onmouseout','onkeypress','ondragstart'];
		attrList.forEach(att => {
			if(ele.hasAttribute(att)){
				ele.style['cursor'] = 'pointer';
			}
		});
	});
}

function ek_uid(name){
	_id++;
	return name+'_'+_id;
}

function ek_overlay_init(){

	if(_ekIsInit.overlay) return _overlay;
	document.body.innerHTML = document.body.innerHTML 
		+ `<div id="ek_overlay" class="ek_overlay"></div>`
		+ `<style>`
			+ `.ek_overlay {`
				+ `position: fixed;`
				+ `display: none;` 
				+ `width: 100%;` 
				+ `height: 100%;` 
				+ `top: 0;`
				+ `left: 0;`
				+ `right: 0;`
				+ `bottom: 0;`
				+ `background-color: rgba(0,0,0,0.5);`
				+ `z-index: 50;`
				+ `cursor: pointer;`
				+ `overflow: auto;`
			+ `}`
			+ `.ek_overlay_content {`
				+ `position: absolute;`
				+ `border: none;`
				+ `top: 50%;`
				+ `left: 50%;`
				+ `transform: translate(-50%,-50%);`
				+ `-ms-transform: translate(-50%,-50%);`
			+ `}`
		+ `</style>`;
	_overlay = document.getElementById('ek_overlay');
	_ekIsInit.overlay = true;
	return _overlay;

}

function ek_navigation_init(){

	document.body.innerHTML = document.body.innerHTML 
		+ `<iframe id="ek_navigation" class="ek_navigation"></iframe>`
		+ `<style>`
			+ `.ek_navigation {`
				+ `position: absolute;`
				+ `display: none;` 
				+ `top: -2px;`
				+ `left: -2px;`
				+ `width: 100%;`
				+ `z-index: 20;`
			+ `}`
		+ `</style>`;
	_navigation = document.getElementById('ek_navigation');
	_ekIsInit.navigation = _navigation;
	return _navigation;

}

function ek_state(event, template, type = 'instant', direction = '', duration = 500, ease = 'linear'){
	
	if(!event.currentTarget) return;

	let elein = event.currentTarget;
	let eleout = document.getElementById(template);
	let elePId = eleout.parentNode.firstElementChild.id;

	elein.innerHTML = '';
	elein.innerHTML = eleout.outerHTML;
	elein.firstElementChild.style.left = '50%'
    elein.firstElementChild.style.top = '50%';
    elein.firstElementChild.style.transform = 'translate(-50%, -50%)';

	if(elein.firstElementChild.hasAttribute('ontimeout')){
		let _timeout = elein.firstElementChild.getAttribute('ontimeout');
		let _delay = elein.firstElementChild.getAttribute('delay');
		setTimeout(fn => {
			eval('let event = {currentTarget:document.getElementById("'+elein.id+'")};'+_timeout);
		},_delay);
	}

	let attrList = ['onclick','onmouseover','onmouseup','onmousedown','onmouseout','onkeypress','ondragstart'];
	attrList.forEach(att => {
		if(elein.firstElementChild.hasAttribute(att)){
			elein.setAttribute(att,elein.firstElementChild.getAttribute(att));
			elein.firstElementChild.removeAttribute(att);
		}else{ 
			elein.removeAttribute(att); 
		}
	});

	ek_animate(elein, null, type, direction, duration, ease);
}

function ek_overlay(event, path, type = 'instant', direction = '', duration = 500, ease = 'linear'){

    let overlay = ek_overlay_init();
    let ccStyles = window.getComputedStyle(document.getElementById('content-container'));
    let docWidth = parseInt(ccStyles.getPropertyValue('width').split('px')[0]);
    let docHeight = parseInt(ccStyles.getPropertyValue('height').split('px')[0]);

    let newid = ek_uid('ek_overlay_content');
    overlay.innerHTML = '';
    overlay.innerHTML = '<iframe id="'+newid+'" class="ek_overlay_content"></iframe>';
    let content = document.getElementById(newid);

	content.src = path;
	content.style['display'] = 'none';

	content.onload = () => {

		let styleout;
		try{ styleout = content.contentWindow.getComputedStyle(content.contentWindow.document.body.children[0].children[0]); }
		catch(e){ styleout = content.contentWindow.getComputedStyle(content.contentWindow.document.body.children[0].children[0]); }

		document.body.style['overflow-y'] = 'hidden';
		overlay.style['display'] = 'table';
		content.style['display'] = 'table';

		let afterEase = () => {
			if(overlay.children.length > 1) overlay.removeChild(overlay.children[1]);
		};
		
		if(type != 'instant') ek_animate(content, null, type, direction, duration, ease, afterEase);
		else afterEase();

		//double check for more elements with interactions
		//[...content.contentWindow.document.querySelectorAll('a')].forEach(a => { a.target = "_parent"; });

		if(parseInt(styleout.getPropertyValue('height').split('px')[0]) > window.innerHeight) content.height = '100%';
		else content.height = styleout.getPropertyValue('height');

		let scrollbarWidth = content.offsetWidth - content.clientWidth;
		content.width = parseInt(styleout.getPropertyValue('width').split('px')[0])+scrollbarWidth+'px';

		content.contentWindow.document.body.children[0].style['width'] = content.width;
		content.contentWindow.document.body.children[0].style['height'] = content.height;

		ek_ontimeout(content.contentWindow.document.body);
		
	};

	overlay.addEventListener('click', e => {
		document.body.style['overflow-y'] = 'auto';
		overlay.style['display'] = 'none';
	});

}

function ek_overlay_close(){
	document.body.style['overflow-y'] = 'auto';
	overlay.style['display'] = 'none';
}

function ek_scroll(event, elein){
	try{ elein = document.getElementById(elein); }catch(e){}
	elein.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

function ek_back(){
	window.history.back();
}

function ek_url(event, url){
	window.open(url, "_blank");
}

function ek_navigate(event, path, type = 'instant', direction = '', duration = 500, ease = 'linear'){

	let navigation = ek_navigation_init();
	let contentContainer = document.getElementById('content-container');
    let ccStyles = window.getComputedStyle(contentContainer);
    let docWidth = parseInt(ccStyles.getPropertyValue('width').split('px')[0]);
    let docHeight = parseInt(ccStyles.getPropertyValue('height').split('px')[0]);

    let docInfo = { title: document.title, body: document.body.innerHTML, head: document.head.innerHTML };

	navigation.src = '';
	navigation.src = path;

	navigation.onload = () => {

		let styleout = navigation.contentWindow.getComputedStyle(navigation.contentWindow.document.body.children[0]);

		navigation.style['display'] = 'table';
		navigation.width = styleout.getPropertyValue('width');
		navigation.height = styleout.getPropertyValue('height');

		let afterEase = () => {

			try{
				contentContainer.style['display'] = 'none';

				document.head.innerHTML = navigation.contentWindow.document.head.innerHTML;
				document.body.innerHTML = navigation.contentWindow.document.body.innerHTML;
				document.title = path.split('.html')[0];

				contentContainer = document.getElementById('content-container');
				contentContainer.style.width = styleout.getPropertyValue('width');
				contentContainer.style.height = styleout.getPropertyValue('height');

				ek_ontimeout(document.body);

				window.history.pushState({"docInfo":JSON.stringify(docInfo)}, path.split('.html')[0], path);
				//window.onpopstate = (e) => { window.location.reload(); };		
				window.onpopstate = (e) => { ek_navigate(event, window.location.href, type, direction, duration, ease); };
			}catch(e){}

		};
		
		if(type != 'instant') ek_animate(navigation.contentWindow.document.getElementById('content-container'), contentContainer, type, direction, duration, ease, afterEase);
		else afterEase();

	};

}

function ek_animate(elein, eleout = null, type = 'disolve', direction = '', duration = 500, ease = 'linear', onComplete = false){

	let animation = [], animation2 = [], timing = {};
	let cssStyles = eleout ? window.getComputedStyle(eleout) : window.getComputedStyle(elein);
	let zeroPos = eleout == null ? '50%' : 0;
	let bounds = {
		top: parseInt(cssStyles.getPropertyValue('top').split('px')[0])
		,left: parseInt(cssStyles.getPropertyValue('left').split('px')[0])
		,bottom: parseInt(cssStyles.getPropertyValue('bottom').split('px')[0])
		,right: parseInt(cssStyles.getPropertyValue('right').split('px')[0])
		,width: parseInt(cssStyles.getPropertyValue('width').split('px')[0])
		,height: parseInt(cssStyles.getPropertyValue('height').split('px')[0])
	};

	timing.duration = duration;
	timing.ease = ease;

	switch(ease){

		case 'EASE_IN':
		case 'ease-in':

			ease = 'ease-in'
			break;

		case 'EASE_OUT':
		case 'ease-out':

			ease = 'ease-out'
			break;

		case 'EASE_IN_AND_OUT':
		case 'ease-in-out':

			ease = 'ease-in-out'
			break;

		default:
			ease = 'linear'
			break;

	}

	switch(type){

		case 'slide':
		case 'SLIDE_IN':
		case 'MOVE_IN':

			switch(direction){

				case '':
				case 'LEFT':
				case 'L':

	    			animation.push({ left: bounds.width+'px', opacity: 0 });
	    			animation.push({ left: zeroPos, opacity: 1 });

					break;

				case 'RIGHT':
				case 'R':

	    			animation.push({ left: -bounds.width+'px', opacity: 0 });
	    			animation.push({ left: zeroPos, opacity: 1 });

					break;

				case 'TOP':
				case 'T':

	    			animation.push({ top: -bounds.height+'px', opacity: 0 });
	    			animation.push({ top: zeroPos, opacity: 1 });

					break;

				case 'BOTTOM':
				case 'B':

	    			animation.push({ top: bounds.height*2+'px', opacity: 0 });
	    			animation.push({ top: zeroPos, opacity: 1 });

					break;

			}

			animation2.push({ opacity: 1 });
			animation2.push({ opacity: 0 });

			elein.animate(animation, timing);
			if(eleout) eleout.animate(animation2, timing);

			break;

		case 'SLIDE_OUT':
		case 'MOVE_OUT':

			eleout.style['z-index'] = 25;

			switch(direction){

				case '':
				case 'LEFT':
				case 'L':

	    			animation.push({ left: zeroPos });
	    			animation.push({ left: bounds.width+'px' });

					break;

				case 'RIGHT':
				case 'R':

	    			animation.push({ left: zeroPos });
	    			animation.push({ left: -bounds.width+'px' });

					break;

				case 'TOP':
				case 'T':

	    			animation.push({ top: zeroPos });
	    			animation.push({ top: bounds.height+'px' });

					break;

				case 'BOTTOM':
				case 'B':

	    			animation.push({ top: zeroPos });
	    			animation.push({ top: -bounds.height+'px' });

					break;

			}

			eleout.animate(animation, timing);

			break;


		case 'push':
		case 'PUSH':

			switch(direction){

				case '':
				case 'LEFT':
				case 'L':

	    			animation.push({ left: bounds.width+'px' });
	    			animation.push({ left: zeroPos });

	    			animation2.push({ left: zeroPos });
	    			animation2.push({ left: -bounds.width+'px' });

					break;

				case 'RIGHT':
				case 'R':

	    			animation.push({ left: -bounds.width+'px' });
	    			animation.push({ left: zeroPos });

	    			animation2.push({ left: zeroPos });
	    			animation2.push({ left: (bounds.width*2)+'px' });

					break;

				case 'TOP':
				case 'T':

	    			animation.push({ top: bounds.height+'px' });
	    			animation.push({ top: zeroPos });

	    			animation2.push({ top: zeroPos });
	    			animation2.push({ top: -bounds.height+'px' });

					break;

				case 'BOTTOM':
				case 'B':

	    			animation.push({ top: -bounds.height+'px' });
	    			animation.push({ top: zeroPos });

	    			animation2.push({ top: zeroPos });
	    			animation2.push({ top: (bounds.height*2)+'px' });

					break;

			}

			elein.animate(animation, timing);
			eleout.animate(animation2, timing);

			break;

		case 'SMART_ANIMATE':
		case 'smart_animate':

			const currentChildElements = elein.querySelectorAll('*');
			const animationProps = [
				'top',
				'left',
				'width',
				'height',
				'opacity',
				'color',
				'background',
				'border',
				'box-shadow',
				'font-size',
				'font-weight',
				'font-style'
			];

			if(!eleout) return;
 
			currentChildElements.forEach((currentChild) => {
				const nameid = currentChild.getAttribute('nameid');
				const newChild = eleout.querySelector(`[nameid="${nameid}"]`);

				if(newChild){

				  const cssStylesCurrent = window.getComputedStyle(currentChild);
				  const cssStylesNew = window.getComputedStyle(newChild);

				  const animationPropsElement = [];//{};

				  animationProps.forEach((prop) => {
				    let csc = cssStylesCurrent.getPropertyValue(prop);
				    let csn = cssStylesNew.getPropertyValue(prop);
				    //if (cssStylesCurrent.getPropertyValue(prop) !== cssStylesNew.getPropertyValue(prop)) {
				      	//animationPropsElement[prop] = [cssStylesCurrent.getPropertyValue(prop), cssStylesNew.getPropertyValue(prop)];
				      	let cscape = {}, csnape = {};
				      	cscape[prop] = csc;
				      	csnape[prop] = csn;
				      	animationPropsElement.push(cscape);
				      	animationPropsElement.push(csnape);
				    //}
				  });

				  if(Object.keys(animationPropsElement).length > 0){
				    const animation = currentChild.animate(animationPropsElement, timing);
				  }
				}
			});
			

		case 'disolve':
		default: 

			animation.push({ opacity: 0 });
			animation.push({ opacity: 1 });

			animation2.push({ opacity: 1 });
			animation2.push({ opacity: 0 });

			elein.animate(animation, timing);
			if(eleout) eleout.animate(animation2, timing);

			break;

	}

	if(onComplete != false) setTimeout(onComplete,duration);

}
