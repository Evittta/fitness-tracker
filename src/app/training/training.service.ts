import { Store } from '@ngrx/store';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { UIService } from './../shared/ui.service';
import { Exercise } from './exercise.model';
import * as fromTraining from './training.reducers';
import * as UI from '../shared/ui.actions';
import * as Training from './training.actions';

@Injectable()
export class TrainingService {
  private fbSubs: Subscription[] = [];

  constructor(
    private firestoreDB: AngularFirestore,
    private uiService: UIService,
    private store: Store<fromTraining.State>
  ) {}

  fetchAvailableExercises() {
    this.store.dispatch(new UI.StartLoading());
    this.fbSubs.push(
      this.firestoreDB
        .collection('availableExercises')
        .snapshotChanges()
        .pipe(
          map((docArray) =>
            docArray.map(({ payload }) => {
              return {
                id: payload.doc.id,
                ...(payload.doc.data() as Exercise),
              };
            })
          )
        )
        .subscribe(
          (exercises: Exercise[]) => {
            this.store.dispatch(new Training.SetAvailableTrainings(exercises));
            this.store.dispatch(new UI.StopLoading());
          },
          () => {
            this.store.dispatch(new UI.StopLoading());
            this.uiService.showSnackBar(
              'Fetching Exercises failed, please try again later',
              'Error',
              { duration: 3000 }
            );
            this.store.dispatch(new Training.SetAvailableTrainings(null));
          }
        )
    );
  }

  startExercise(selectedId: string) {
    this.store.dispatch(new Training.StartTraining(selectedId));
  }

  completeExercise() {
    this.store
      .select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe((activeTraining) => {
        this.addDataToDatabase({
          ...activeTraining,
          date: new Date(),
          state: 'completed',
        });
        this.store.dispatch(new Training.StopTraining());
      });
  }

  cancelExercise(progress: number) {
    this.store
      .select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe((activeTraining) => {
        this.addDataToDatabase({
          ...activeTraining,
          duration: activeTraining.duration * (progress / 100),
          calories: activeTraining.duration * (progress / 100),
          date: new Date(),
          state: 'cancalled',
        });
        this.store.dispatch(new Training.StopTraining());
      });
  }

  fetchCompletedOrCanceledExercises() {
    this.fbSubs.push(
      this.firestoreDB
        .collection('finishedExercises')
        .valueChanges()
        .subscribe((exercises: Exercise[]) =>
          this.store.dispatch(new Training.SetFinishedTrainings(exercises))
        )
    );
  }

  cancelSubscription() {
    this.fbSubs.forEach((sub) => sub.unsubscribe());
  }

  private addDataToDatabase(exercise: Exercise) {
    this.firestoreDB.collection('finishedExercises').add(exercise);
  }
}
