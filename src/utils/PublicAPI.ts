import { JsonArray, JsonObject, JsonValue } from "type-fest";
import { watch } from "vue";
import { EventDispatcher } from "./EventDispatcher";
import OBSWebsocket from "./OBSWebsocket";
import TwitchatEvent, { TwitchatActionType, TwitchatEventType } from "./TwitchatEvent";

/**
* Created : 14/04/2022 
*/
export default class PublicAPI extends EventDispatcher {

	private static _instance:PublicAPI;

	private _bc!:BroadcastChannel;
	
	constructor() {
		super();
	}
	
	/********************
	* GETTER / SETTERS *
	********************/
	static get instance():PublicAPI {
		if(!PublicAPI._instance) {
			PublicAPI._instance = new PublicAPI();
		}
		return PublicAPI._instance;
	}
	
	
	
	/******************
	* PUBLIC METHODS *
	******************/
	/**
	 * Initializes the public API
	 */
	public initialize():void {
		this._bc = new BroadcastChannel("twitchat");

		//If receiving data from another browser tab, broadcast it
		this._bc.onmessage = (e: MessageEvent<unknown>):void => {
			const event = e.data as {type:TwitchatActionType, data:JsonObject | JsonArray | JsonValue}
			this.dispatchEvent(new TwitchatEvent(event.type, event.data));
		}
		
		this.listenOBS();
	}

	/**
	 * Broadcast a message
	 * 
	 * @param type 
	 * @param data 
	 */
	public async broadcast(type:TwitchatEventType|TwitchatActionType, data?:JsonObject):Promise<void> {
		//Broadcast to other browser's tabs
		try {
			if(data) data = JSON.parse(JSON.stringify(data));
			this._bc.postMessage({type, data});
		}catch(error) {
			console.error(error);
		}

		//Broadcast to any OBS Websocket connected client
		OBSWebsocket.instance.broadcast(type, data);
	}
	
	
	
	/*******************
	* PRIVATE METHODS *
	*******************/
	private listenOBS():void {
		//OBS api not ready yet, wait for it
		if(!OBSWebsocket.instance.obsSocket) {
			watch(()=>OBSWebsocket.instance.obsSocket, ()=> {
				this.listenOBS();
			});
			return;
		}
		
		//@ts-ignore
		OBSWebsocket.instance.obsSocket.on("CustomEvent",
		(e:{origin:"twitchat", type:TwitchatActionType, data:JsonObject | JsonArray | JsonValue}) => {
			if(e.type == undefined) return;
			if(e.origin != "twitchat") return;
			this.dispatchEvent(new TwitchatEvent(e.type, e.data));
		})
	}
}