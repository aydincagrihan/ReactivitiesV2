import { makeAutoObservable, reaction, runInAction } from "mobx";
import { Activity, ActivityFormValues } from "../models/activity";
import agent from "../api/agent";
import { v4 as uuid } from "uuid";
import { textSpanIntersectsWithPosition } from "typescript";
import { format } from "date-fns";
import { store } from "./store";
import { Profile } from "../models/profile";
import { Pagination, PagingParams } from "../models/pagination";

export default class ActivityStore {
  activities: Activity[] = [];
  activityRegistry = new Map<string, Activity>();
  selectedActivity: Activity | undefined = undefined;
  editMode: boolean = false;
  loading: boolean = false;
  loadingInitial: boolean = false;
  pagination: Pagination | null = null;
  pagingParams = new PagingParams();
  predicate = new Map().set("all", true);

  constructor() {
    makeAutoObservable(this);

    reaction(
        () => this.predicate.keys(),
        () => {
            this.pagingParams = new PagingParams();
            this.activityRegistry.clear();
            this.loadActivities();
        }
    )
}
  setPagingParams = (pagingParams: PagingParams) => {
    this.pagingParams = pagingParams;
  };

  setPredicate = (predicate: string, value: string | Date) => {
    const resetPredicate = () => {
        this.predicate.forEach((value, key) => {
            if (key !== 'startDate') this.predicate.delete(key);
        })
    }
    switch (predicate) {
        case 'all':
            resetPredicate();
            this.predicate.set('all', true);
            break;
        case 'isGoing':
            resetPredicate();
            this.predicate.set('isGoing', true);
            break;
        case 'isHost':
            resetPredicate();
            this.predicate.set('isHost', true);
            break;
        case 'startDate':
            this.predicate.delete('startDate');
            this.predicate.set('startDate', value);
            break;
    }
}

  get axiosParams() {
    const params = new URLSearchParams();
    params.append("pageNumber", this.pagingParams.pageNumber.toString());
    params.append("pageSize", this.pagingParams.pageSize.toString());
    this.predicate.forEach((value, key) => {
      if (key === "startDate") {
        params.append(key, (value as Date).toISOString());
      } else {
        params.append(key, value);
      }
    });

    return params;
  }

  // "!" bang operator that means variable can not be null or undefined
  get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort(
      (a, b) => a.date!.getTime() - b.date!.getTime()
    );
  }
  //Tarih sıralaması için kullanıldı
  get groupedActivities() {
    return Object.entries(
      this.activitiesByDate.reduce((activities, activity) => {
        const date = format(activity.date!, "dd MM yyyy");
        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity];
        return activities;
      }, {} as { [key: string]: Activity[] })
    );
  }

  loadActivities = async () => {
    this.setLoadingInitial(true);
    try {
      const result = await agent.Activities.list(this.axiosParams);
      result.data.forEach((activity) => {
        //response gelip datalar basılmadan önce tarih formatında düzenleme yaptım//
        // activity.date = activity.date.split("T")[0];
        // this.activities.push(activity);
        // this.activityRegistry.set(activity.id, activity);
        this.setActivity(activity);
      });
      this.setPagination(result.pagination);
      this.setLoadingInitial(false);
    } catch (error) {
      console.log(error);
      this.setLoadingInitial(false);
    }
  };

  setPagination = (pagination: Pagination) => {
    this.pagination = pagination;
  };

  //loadSingle Activity
  loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity) {
      this.selectedActivity = activity;
      return activity;
    } else {
      this.setLoadingInitial(true);

      try {
        const response = await agent.Activities.details(id);
        activity = response.data;
        this.setActivity(activity);
        runInAction(() => {
          this.selectedActivity = activity;
        });
        this.setLoadingInitial(false);
        return activity;
      } catch (error) {
        console.log(error);
      }
    }
  };
  private setActivity = (activity: Activity) => {
    // bir kullanıcının etkinliğe katılıp katılmadığını kontrol etmek ve etkinliği oluşturan
    // kişinin aynı zamanda etkinliğin  ev sahibi olup olmadığını belirlemek için kullanılıyor.

    const user = store.userStore.user;
    if (user) {
      activity.isGoing = activity.attendees!.some(
        (a) => a.username === user.userName
      );
      activity.isHost = activity.hostUsername === user.userName;
      activity.host = activity.attendees?.find(
        (x) => x.username === activity.hostUsername
      );
    }

    activity.date = new Date(activity.date!);
    // activity.date = activity.date.split("T")[0];
    this.activityRegistry.set(activity.id, activity);
  };
  private getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  };

  // selectActivity = (id: string) => {
  //   // this.selectedActivity=this.activities.find(a=>a.id === id);
  //   this.selectedActivity = this.activityRegistry.get(id);
  // };
  // cancelSelectedActivity = () => {
  //   this.selectedActivity = undefined;
  // };

  // openForm = (id?: string) => {
  //   console.log(id);
  //   if (id) {
  //     this.selectActivity(id);
  //   } else {
  //     this.cancelSelectedActivity();
  //   }
  //   this.editMode = true;
  // };

  // closeForm() {
  //   this.editMode = false;
  // }
  //burda arrow funciton yerine normak funciton kullandığımda "this."  keywordunde bulunan değişkenleri bulamıyor kesinlikle "arrow function kullanılmalı"
  createActivity = async (activity: ActivityFormValues) => {
    const user = store.userStore.user;
    const attendee = new Profile(user!);
    try {
      await agent.Activities.create(activity);
      const newActivity = new Activity(activity);
      newActivity.hostUsername = user!.userName;
      newActivity.attendees = [attendee];
      this.setActivity(newActivity);
      runInAction(() => {
        this.selectedActivity = newActivity;
      });
    } catch (error) {
      console.log(error);
    }
  };

  updateActivity = async (activity: ActivityFormValues) => {
    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        if (activity.id) {
          const updatedActivity = {
            ...this.getActivity(activity.id),
            ...activity,
          };
          this.activityRegistry.set(activity.id, updatedActivity as Activity);
          this.selectedActivity = updatedActivity as Activity;
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  deleteActivity = async (id: string) => {
    this.loading = true;
    try {
      // this.activities=[...this.activities.filter(a=>a.id!==id)];
      await agent.Activities.delete(id);
      runInAction(() => {
        this.activityRegistry.delete(id);
        // if (this.selectedActivity?.id === id) this.cancelSelectedActivity();
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  updateAttendance = async () => {
    const user = store.userStore.user;
    this.loading = true;
    try {
      await agent.Activities.attend(this.selectedActivity!.id);
      runInAction(() => {
        //activity iptal işlemi
        if (this.selectedActivity?.isGoing) {
          this.selectedActivity.attendees =
            this.selectedActivity.attendees?.filter(
              (a) => a.username !== user?.userName
            );
          this.selectedActivity.isGoing = false;
        }
        //join to activity
        else {
          const attendee = new Profile(user!);
          this.selectedActivity?.attendees?.push(attendee);
          this.selectedActivity!.isGoing = true;
        }
        this.activityRegistry.set(
          this.selectedActivity!.id,
          this.selectedActivity!
        );
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  cancelActivityToggle = async () => {
    this.loading = true;
    try {
      await agent.Activities.attend(this.selectedActivity!.id);
      runInAction(() => {
        this.selectedActivity!.isCancelled =
          !this.selectedActivity!.isCancelled;
        this.activityRegistry.set(
          this.selectedActivity!.id,
          this.selectedActivity!
        );
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  clearSelectedActivity = () => {
    this.selectedActivity = undefined;
  };

  updateAttendeeFollowing = (username: string) => {
    this.activityRegistry.forEach((activity) => {
      activity.attendees?.forEach((attendee: Profile) => {
        if (attendee.username === username) {
          attendee.following
            ? attendee.followersCount--
            : attendee.followersCount++;
          attendee.following = !attendee.following;
        }
      });
    });
  };
}
