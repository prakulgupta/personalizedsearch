import { HttpClient } from '@angular/common/http';

export class ConnectionsService{
    constructor(private http: HttpClient) { }

    public getConnections(request : IConnectionRequest){
        return this.http.post<IConnectionRequest>(`http://localhost:7071/api/connections`, request);
    }
}