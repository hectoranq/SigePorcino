
export interface PlanData {
    id: string;
    plan_name: string;
    price: number;
    description: string;
    created: string;
    updated: string;
  }
  
  class Plan {
    id: string;
    name: string;
    price: number;
    description: string;
    created: Date;
    updated: Date;
  
    constructor(data: PlanData) {
      this.id = data.id;
      this.name = data.plan_name;
      this.price = data.price;
      this.description = data.description;
      this.created = new Date(data.created);
      this.updated = new Date(data.updated);
    }
  }
  
  export default Plan;
  