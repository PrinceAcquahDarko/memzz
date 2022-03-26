import {v2} from 'cloudinary'
import { ConfigService } from '@nestjs/config';

function cloudi(){
    
    let config = new ConfigService()
    v2.config({
        cloud_name: config.get('cloud_name'),
        api_key : config.get('api_key'),
        api_secret: config.get('api_secret')
    })

    return v2

}




export {cloudi as v2}