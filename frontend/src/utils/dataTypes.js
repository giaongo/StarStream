const EVENT_STATUS = {};

EVENT_STATUS[(EVENT_STATUS[1] = "Upcoming")] = 1;

EVENT_STATUS[(EVENT_STATUS[2] = "Live")] = 2;

EVENT_STATUS[(EVENT_STATUS[3] = "Ended")] = 3;

const AI_CHAT_TYPE = {};

AI_CHAT_TYPE[(AI_CHAT_TYPE[1] = "Question")] = 1;
AI_CHAT_TYPE[(AI_CHAT_TYPE[2] = "Answer")] = 2;

class AIChatContent {
  constructor(type, data) {
    this.type = type;
    this.data = data;
  }
}

export { EVENT_STATUS, AIChatContent, AI_CHAT_TYPE };
