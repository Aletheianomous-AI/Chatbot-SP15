from datetime import datetime as dt

import torch
from transformers import pipeline

DEBUG_MODE: bool = True

pipe = pipeline("text-generation", model="HuggingFaceH4/zephyr-7b-alpha", torch_dtype=torch.bfloat16, device_map="auto")
messages = [
    {
        "role": "system",
        "content": "You are a friendly chatbot that provides reliable information to the user. Your goals are to reduce suffering in the universe, increase prosperity in the universe, and increase understanding in the universe."
    },
    {
        "role": "user", "content": """Could you please summarize the following section:\nOpenAI fired back at Elon Musk, who sued the ChatGPT company last week for chasing profit and diverging from its original, nonprofit mission. 
        Tuesday night, OpenAI published several of Musk's emails from the early days of the company that appear to show Musk acknowledging OpenAI needed to make a ton of money to fund the incredible computing resources needed to 
        power its AI ambitions. In the emails, parts of which have been redacted, Musk argues that the company stood virtually no chance of building a successful generative AI platform by raising cash alone, and the company needed
         to find alternate sources of revenue to survive. In a November 22, 2015, email to CEO Sam Altman, Musk, an OpenAI co-founder, said the company needed to raise much more than $100 million to \"avoid sounding hopeless.\" 
        Musk suggested a $1 billion funding commitment and promised that he would cover whatever did not get raised. OpenAI in a blog post Tuesday night said Musk never followed through on his promise, committing $45 million in 
        funding for OpenAI, while other donors raised $90 million. Lawyers for Musk declined to comment on OpenAI's claims. Musk, in a February 1, 2018, email, told company executives that the only path forward for OpenAI was for 
        Tesla, his electric car company, to buy it. The company refused, and Musk left OpenAI later that year. In December 2018, Musk emailed Altman and other executives that OpenAI would not be relevant \"without a dramatic 
        change in execution and resources.\" \"This needs billions per year immediately or forget it,\" Musk emailed. \"I really hope I'm wrong.\" OpenAI executives agreed. In 2019, they formed OpenAI LP, a for-profit entity 
        that exists within the larger company's structure. That for-profit company took OpenAI from effectively worthless to a valuation of $90 billion in just a few years — and Altman is largely credited as the mastermind of that 
        plan and the key to the company's success. Microsoft has since committed $13 billion in a close partnership with OpenAI. Musk's complaint, filed last week in California state court, said that company and its partnership with 
        Microsoft violated OpenAI's founding charter, representing a breach of contract. Musk is asking for a jury trial and for the company, Altman and co-founder Greg Brockman to pay back the profit they received from the business.
        OpenAI was founded as a check on what the founders believed is a serious threat that artificial generative intelligence, or AGI, posed to humanity. The company created a board of overseers to review any product the company created, 
        and its products' code was made public. The company said in its blog post that it has not diverged from its mission, and it would move to dismiss all of Musk's claims. It said its technology is broadly available and improves people's 
        lives, while the company continues to commit to the safety of its products. \"We're sad that it's come to this with someone whom we've deeply admired—someone who inspired us to aim higher, then told us we would fail, started a competitor,
        and then sued us when we started making meaningful progress towards OpenAI's mission without him,\" the company said in its blog post."""
    }
]

start_time = dt.now()
prompt = pipe.tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)

output = pipe(prompt, max_new_tokens=256, do_sample=True, temperature=0.7, top_k=50, top_p=0.95)
end_time = dt.now()
text_gen_time = end_time - start_time
print(output[0]["generated_text"])
if DEBUG_MODE:
    print("\n Text generation time: " + str(text_gen_time))

