//@ts-nocheck

import OpenAI from "openai";
import JobApplication from "../../persistance/entities/JobApplication";
import Job from "../../persistance/entities/jobs";

const client = new OpenAI({apiKey:process.env.OPENAI_API_KEY});

export async function generateRating(jobApplicationId){

    const jobApplication = await JobApplication.findById(jobApplicationId).populate("job");

    //Role: software Engineer,Description: "description"
    const content = `Role:${jobApplication?.job.title}, User Description: ${jobApplication?.answers.join(". ")}`

    const completion = await client.chat.completions.create(

        {
            messages: [{role:"user",content}],
            model:"-"
        }
    );

    const response = JSON.parse(completion.choices[0].message.content);

    if(!response.rate){
        return;
    }

    //response = {"rate": "good"}
    //resonse.rate = "good"
    await JobApplication.findOneAndUpdate({_id:jobApplicationId},{rating:response.rate})

}