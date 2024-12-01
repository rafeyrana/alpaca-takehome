from abc import ABC, abstractmethod
from typing import Optional

class BaseLLMClient(ABC):
    """Base class for LLM clients. All LLM implementations should inherit from this."""
    
    @abstractmethod
    async def generate_response(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: Optional[float] = 0.7,
        max_tokens: Optional[int] = None
    ) -> str:
        """
        Generate a response from the LLM.
        
        Args:
            system_prompt: The system prompt to set context
            user_prompt: The user's input prompt
            temperature: Controls randomness in the output (0.0 to 1.0)
            max_tokens: Maximum number of tokens to generate
            
        Returns:
            str: The generated response
        """
        pass
