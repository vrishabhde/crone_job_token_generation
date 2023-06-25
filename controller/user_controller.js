import Users from "../models/register.js"
import { CronJob } from "cron";
import axios from "axios";

export const search = async (req, res) => {
    try {

        const options = {
            method: 'POST',
            url: 'https://skyscanner-api.p.rapidapi.com/v3/flights/live/search/create',
            headers: {
                'content-type': 'application/json',
                'X-RapidAPI-Key': 'b2e4a5ee6emshbad2e42c37a9ba1p14dc00jsn0ad4451b885b',
                'X-RapidAPI-Host': 'skyscanner-api.p.rapidapi.com',

            },
            data: {
                query: {
                    market: 'UK',
                    locale: 'en-GB',
                    currency: 'EUR',
                    queryLegs: [
                        {
                            originPlaceId: { iata: 'LHR' },
                            destinationPlaceId: { iata: 'DXB' },
                            date: {
                                year: 2023,
                                month: 9,
                                day: 20
                            }
                        }
                    ],
                    cabinClass: 'CABIN_CLASS_ECONOMY',
                    adults: 2,
                    childrenAges: [3, 9]
                }
            }
        };

        const response = await axios.request(options);
        console.log(response.data);

        const check = await Users.findOne({});
        if (check) {
            check.access_token = response.data.sessionToken
            await check.save();
            console.log(check);
            return res.send(check);
        }
        const user = new Users({
            access_token: response.data.sessionToken
        });

        await user.save();

        return res.send(response.data);

    } catch (error) {
        console.error(error);
    }
}



export const getsearch = async (req, res) => {
    try {
        const { id } = req.body;
        const check = await Users.find({ _id: id }).exec();

        const options = {
            method: 'POST',
            url: `https://skyscanner-api.p.rapidapi.com/v3/flights/live/search/poll/${check[0].access_token}`,
            headers: {
                'X-RapidAPI-Key': 'b2e4a5ee6emshbad2e42c37a9ba1p14dc00jsn0ad4451b885b',
                'X-RapidAPI-Host': 'skyscanner-api.p.rapidapi.com'
            }
        };
        const response = await axios.request(options);

        console.log(response.data);
        return res.send(response.data);
    } catch (error) {
        console.error(error);
    }
}



const job = new CronJob('*/2 * * * *', function () {
    Users.updateOne({}, { $unset: { access_token: 1 } }).exec();
    console.log('Every two Minute:');
});
console.log('After job instantiation');
job.start();


