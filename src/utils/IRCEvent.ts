import { Event } from '@/utils/EventDispatcher';
import { AnonSubGiftUpgradeUserstate, AnonSubGiftUserstate, ChatUserstate, DeleteUserstate, MsgID, SubGiftUpgradeUserstate, SubGiftUserstate, SubMethods, SubUserstate } from 'tmi.js';
import { PubSubTypes } from './PubSub';

/**
* Created : 07/12/2020 
*/
export default class IRCEvent extends Event {

	public static MESSAGE:string = "MESSAGE";
	public static UNFILTERED_MESSAGE:string = "UNFILTERED_MESSAGE";
	public static CONNECTED:string = "CONNECTED";
	public static DISCONNECTED:string = "DISCONNECTED";
	public static BADGES_LOADED:string = "BADGES_LOADED";
	public static TIMEOUT:string = "TIMEOUT";
	public static NOTICE:string = "NOTICE";
	public static HIGHLIGHT:string = "HIGHLIGHT";
	public static BAN:string = "BAN";
	public static CLEARCHAT:string = "CLEARCHAT";
	public static DELETE_MESSAGE:string = "DELETE_MESSAGE";
	public static AUTOMOD:string = "AUTOMOD";
	public static ROOMSTATE:string = "ROOMSTATE";
	
	constructor(type:string, public data?:IRCEventData) {
		super(type);
	}
	
}

export type IRCEventData = IRCEventDataList.Message
						|  IRCEventDataList.Timeout
						|  IRCEventDataList.Ban
						|  IRCEventDataList.MessageDeleted
						|  IRCEventDataList.Automod
						|  IRCEventDataList.Notice
						|  IRCEventDataList.Highlight
						|  IRCEventDataList.Hosted
						|  IRCEventDataList.RoomState;

export namespace IRCEventDataList {
	export interface Message {
		channel:string;
		message:string;
		tags:ChatUserstate;
		self:boolean;
		//Custom injected props
		firstMessage:boolean;
		automod?:PubSubTypes.AutomodData;
		reward?:PubSubTypes.RewardData;
		answerTo?:Message;
		answers?:Message[];
		cyphered?:boolean;
		markedAsRead?:boolean;
		showHoverActions?:boolean;
		type:"message";
	}

	export interface Timeout {
		channel: string;
		username: string;
		reason: string;
		duration: number;
		//custom data
		type:"notice";
	}

	export interface Ban {
		channel: string;
		username: string;
		reason: string;
		//custom data
		type:"notice";
	}

	export interface MessageDeleted {
		channel: string;
		username: string;
		deletedMessage: string;
		tags: DeleteUserstate;
		//custom data
		type:"message";
	}

	export interface Automod {
		channel: string;
		message: string;
		msgID: 'msg_rejected' | 'msg_rejected_mandatory';
		type:"message";
	}

	export interface Notice {
		channel: string;
		message?: string;
		msgid: MsgID|string;
		tags:ChatUserstate;
		username?: string;
		//custom data
		type:"notice";
	}

	export interface Hosted {
		channel: string;
		viewers: number;
		autohost:boolean;
		username?: string;
		tags:ChatUserstate;
		message:string;
		msgid: MsgID;
		//custom data
		type:"notice";
	}

	export interface Highlight {
		channel: string;
		message?: string;
		tags:ChatUserstate | SubUserstate | SubGiftUserstate | SubGiftUpgradeUserstate | AnonSubGiftUpgradeUserstate | AnonSubGiftUserstate;
		months?:number;
		username?: string;
		sender?: string;
		recipient?: string;
		methods?: SubMethods;
		viewers?: number;
		"msg-id"?: MsgID;
		reward?: PubSubTypes.RewardData;
		//custom data
		firstMessage?:boolean;
		type:"highlight";
	}

	export interface RoomState {
		type:"notice";
		raw: string;
		tags: {
			"emote-only": boolean;
			"followers-only": string;
			r9k: boolean;
			rituals: boolean;
			"room-id": string;
			slow: boolean;
			"subs-only": boolean;
			channel: string;
		};
		prefix: string;
		command: string;
		params: string[];
	}
}