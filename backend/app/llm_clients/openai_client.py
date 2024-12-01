from typing import Optional
import os
from langchain_openai import ChatOpenAI
from langchain.schema import SystemMessage, HumanMessage
from dotenv import load_dotenv

from .base import BaseLLMClient

# Load environment variables from .env file
load_dotenv()

class OpenAIClient(BaseLLMClient):

    def __init__(self, model_name: str = "gpt-4-turbo"):
        self.model_name = model_name
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY environment variable is not set")
            
        self.llm = ChatOpenAI(
            model_name=model_name,
            temperature=0.7,
            openai_api_key=api_key
        )
    
    async def generate_response(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: Optional[float] = 0.7,
        max_tokens: Optional[int] = None
    ) -> str:
        if temperature != 0.7:
            self.llm.temperature = temperature
            
        # Create message list
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=user_prompt)
        ]
        
        # Generate response
        response = await self.llm.ainvoke(messages)
        return response.content
