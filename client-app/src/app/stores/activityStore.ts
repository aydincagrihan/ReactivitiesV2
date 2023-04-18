import { makeAutoObservable, runInAction } from "mobx";
import { Activity } from "../models/activity";
import agent from "../api/agent";
import { v4 as uuid } from "uuid";
import { textSpanIntersectsWithPosition } from "typescript";

export default class ActivityStore {
  activities: Activity[] = [];
  activityRegistry=new Map<string,Activity>();
  selectedActivity: Activity | undefined = undefined;
  editMode: boolean = false;
  loading: boolean = false;
  loadingInitial: boolean = true;

  constructor() {
    makeAutoObservable(this);
  }

  get activitiesByDate(){
    return Array.from(this.activityRegistry.values()).sort((a,b) => Date.parse(a.date)- Date.parse(b.date));
  }

  loadActivities = async () => {
    try {
      const activities = await agent.Activities.list();
      activities.forEach((activity) => {
        //response gelip datalar basılmadan önce tarih formatında düzenleme yaptım
        activity.date = activity.date.split("T")[0];
        this.activities.push(activity);
        this.activityRegistry.set(activity.id,activity);
      });
      this.setLoadingInitial(false);
    } catch (error) {
      console.log(error);
      this.setLoadingInitial(false);
    }
  };
  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  };

  selectActivity=(id: string) => {
    // this.selectedActivity=this.activities.find(a=>a.id === id);
    this.selectedActivity=this.activityRegistry.get(id);
  }
cancelSelectedActivity = () => {
  this.selectedActivity = undefined;
}

  openForm = (id?: string) => {
    console.log(id)
    if (id) {
      this.selectActivity(id);
    } else {
      this.cancelSelectedActivity();
    }
    this.editMode = true;
  }
  

  closeForm() {
    this.editMode = false;
  }
//burda arrow funciton yerine normak funciton kullandığımda "this."  keywordunde bulunan değişkenleri bulamıyor kesinlikle "arrow function kullanılmalı"
  createActivity = async (activity: Activity) => {
    this.loading = true;
    activity.id = uuid();
    try {
      await agent.Activities.create(activity);
      runInAction(()=>{
        this.activityRegistry.set(activity.id,activity);
        this.activities.push(activity);
        this.selectedActivity=activity;
        this.editMode=false;
        this.loading=false;
      })
    } catch (error) {
      console.log(error);
      runInAction(()=>{
        this.loading=false;
      })
    }
  };

  updateActivity = async (activity: Activity) => {
    this.loading = true;
    try {
      await agent.Activities.update(activity);
      runInAction(()=>{
        // this.activities=[...this.activities.filter(a=>a.id!==activity.id),activity];
        this.activityRegistry.set(activity.id,activity);
        this.selectedActivity=activity;
        this.editMode=false;
        this.loading=false;
      })
      
    } catch (error) {
      console.log(error);
      runInAction(()=>{
        this.loading=false;
      })
    }
  }

  deleteActivity=async(id:string)=>{
    this.loading=true;
    try {
      // this.activities=[...this.activities.filter(a=>a.id!==id)];
      await agent.Activities.delete(id);
      runInAction(()=>{
      this.activityRegistry.delete(id);
        if(this.selectedActivity?.id===id) this.cancelSelectedActivity();
        this.loading=false;
      })
    
      
    } catch (error) {
      console.log(error);
      runInAction(()=>{
        this.loading=false;
      })
    }
  }
}
