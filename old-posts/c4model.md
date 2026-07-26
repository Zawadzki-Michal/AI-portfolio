C4 Model: Telling the Story of Your Software
Hi, it's Michał here again. Today, I've got something important to share, a learning from last week that really struck a chord with me. As I navigate this tech world, I find it crucial to not just share my journey but also to provide insights that might help others who are on a similar path—trying to break into tech or preparing for job interviews.

In my earlier posts, I've talked about how making connections on LinkedIn has opened doors to meet some incredible people in the tech industry. One such connection, a CTO at a prominent tech company, offered me some invaluable advice. It's about understanding and focusing on aspects of technology that we, as juniors, might overlook – not because we don't know better, but because our attention is often pulled in so many directions.

This person, who's been in the tech field for a long time, shared insights in a half-hour chat that were more valuable than many of the hours I've spent watching tutorials online.

We were discussing my website project. I went into detail about the tech stack I chose, the features and components I've implemented – basically the whole process I went through. However, I hit a snag when I was asked to illustrate and explain the architecture of my website. I knew my site utilised a CMS and was built using reusable components, but visually articulating this in a structured architectural diagram was a struggle to me.

That's when I first heard about C4 modelling, a concept that was new to me but incredibly interesting.

C4 modelling is a method for visualising and describing software architecture. It's straightforward yet comprehensive. I found an excellent resource: a video on YouTube by Simon Brown, the originator of C4 modelling. This video gave me a thorough understanding of the concept.
https://www.youtube.com/watch?v=9noJwoIivV8

The C4 Model breaks down into four distinct levels:

First, there's the Context, which is about how your system works with things around it – like users and other systems. It sets the stage by showing the ecosystem in which your application operates.

Next, you look at Containers, where you identify the high-level tech structures, like databases, file systems, and other platforms that make up your system.

Then comes Components, where you break down the containers into their specific parts, detailing how they interact and their responsibilities.

And finally, the Code level, where you get a detailed view of the actual modules and classes that make up your application.

But it's not just about creating diagrams. This model is a comprehensive way to understand and communicate your software's architecture.

In our conversation, the CTO emphasised a critical aspect of tech interviews that really made me think. When you're in an interview, especially for a tech position, it's not just about the code you write. What's equally important is your ability to take apart complex problems and explain them clearly. This means showing that you understand how different parts of a system work together – what we often refer to as layered architectures. It's about looking at a software system and seeing more than just code; it's seeing how the pieces fit into a larger picture.

Then he explained to me that interviewers often look for your ability to make smart design decisions. This is where a few key concepts come into play, and understanding these can really set you apart:

"Separation of Concerns": This principle is all about organising a system so that each part handles a specific function or concern. It's like making sure that each piece of the puzzle does its own job without interfering with the others. In practice, this means your code is cleaner, more efficient, and easier to maintain because changes in one part don't cause a ripple effect across the whole system.
"Single Responsibility": This concept goes hand in hand with Separation of Concerns. It's the idea that every module or class in your system should have one reason to change, meaning it should have only one job or responsibility. This makes your code more robust and flexible because each part is independent and focused, making it easier to update and debug.
"Abstraction": This is a bit like simplifying a complex reality. You create a simpler interface for interacting with a component or system, hiding the complicated underlying details. It’s like how you interact with a car – you don’t need to know the intricacies of how the engine works to drive the car. In software, using abstraction means you can work with complex systems without getting bogged down in every little detail.
Understanding and effectively using these concepts within the C4 framework – which helps visualise and describe software architecture, can demonstrate a deep and thoughtful approach to software design. It shows that you're not just coding; you're thinking about how each piece of your code fits into the bigger picture, how it affects and is affected by other parts, and how to manage complexity in a way that makes your software better.

To wrap up, I realised something crucial: in software development, your ability to create outstanding software is one thing, but your capability to present it, to tell the story behind it, is equally crucial. It's the narrative of the choices, the trade-offs, and the reasoning behind each decision that elevates you from just being a coder to a true software engineer. And that's the real essence of C4 Modeling – it teaches you to narrate the story of your software effectively.

Before I end this post, I wanted to add one more thing. Recently, I've been working on integrating social media share buttons into my blog posts. If you find this post insightful and believe it could benefit someone in your network, I encourage you to share it on social media. Let's spread the word and support each other in our tech journeys.

Additionally, if you have any tips or insights regarding architectural structure interviews or anything else that could aid in my preparation, I'd love to hear from you. Please drop your suggestions and advice in the comments section below. Your input is invaluable and greatly appreciated.

Thank you for taking the time to read this post. Until next time, let's keep learning.