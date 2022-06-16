export interface Schedule{
	user?  : number;
	time  : number;
	dow   : number;
	taken? : boolean;
}

export interface TimeBlock{
	id		: number;
	start : string;
	end 	: string;
	inning : number
}
