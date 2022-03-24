import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetUser = createParamDecorator(
    (data:any, ctx:ExecutionContext) => {
        const request = ctx
            .switchToHttp()
            .getRequest();

            if(data){
                if(data === 'password'){
                    return request.user
                }
                delete request.user.password
                return request.user[data]
            }
            delete request.user.password
            return request.user
        }
)