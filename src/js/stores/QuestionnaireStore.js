import { ReduceStore } from 'flux/utils';
import Dispatcher from '../common/dispatcher/Dispatcher';

class QuestionnaireStore extends ReduceStore {
  getInitialState () {
    return {
      allCachedQuestionnairesDict: {}, // This is a dictionary key: questionnaireId, value: questionnaire dict
      allCachedQuestionsDict: {}, // This is a dictionary key: questionId, value: question dict
      mostRecentQuestionIdSaved: -1,
      mostRecentQuestionSaved: {
        questionnaireId: -1,
      },
      mostRecentQuestionnaireIdSaved: -1,
      mostRecentQuestionnaireSaved: {
        firstName: '',
        lastName: '',
        questionnaireId: -1,
      },
      searchResults: [],
    };
  }

  getAllCachedQuestionnairesList () {
    const { allCachedQuestionnairesDict } = this.getState();
    const questionnaireListRaw = Object.values(allCachedQuestionnairesDict);

    const questionnaireList = [];
    let questionnaireFiltered;
    let questionnaireRaw;
    for (let i = 0; i < questionnaireListRaw.length; i++) {
      questionnaireRaw = questionnaireListRaw[i];
      // console.log('QuestionnaireStore getAllCachedQuestionnairesList questionnaire:', questionnaire);
      questionnaireFiltered = questionnaireRaw;
      questionnaireList.push(questionnaireFiltered);
    }
    return questionnaireList;
  }

  getFirstName (questionnaireId) {
    const questionnaire = this.getQuestionnaireById(questionnaireId);
    return questionnaire.firstName || '';
  }

  getLastName (questionnaireId) {
    const questionnaire = this.getQuestionnaireById(questionnaireId);
    return questionnaire.lastName || '';
  }

  getMostRecentQuestionnaireChanged () {
    // console.log('QuestionnaireStore getMostRecentQuestionnaireChanged Id:', this.getState().mostRecentQuestionnaireIdSaved);
    if (this.getState().mostRecentQuestionnaireIdSaved !== -1) {
      return this.getQuestionnaireById(this.getState().mostRecentQuestionnaireIdSaved);
    }
    return {};
  }

  getMostRecentQuestionnaireIdChanged () {
    // console.log('QuestionnaireStore getMostRecentQuestionnaireChanged Id:', this.getState().mostRecentQuestionnaireIdSaved);
    return this.getState().mostRecentQuestionnaireIdSaved;
  }

  getQuestionListByQuestionnaireId (questionnaireId) {
    const { allCachedQuestionsDict } = this.getState();
    const questionListRaw = Object.values(allCachedQuestionsDict);
    const questionListForQuestionnaire = [];
    for (let i = 0; i < questionListRaw.length; i++) {
      if (questionListRaw[i].questionnaireId === questionnaireId) {
        questionListForQuestionnaire.push(questionListRaw[i]);
      }
    }
    // console.log('QuestionnaireStore getQuestionnaireById:', questionnaireId, ', questionListForQuestionnaire:', questionListForQuestionnaire);
    return questionListForQuestionnaire;
  }

  getQuestionById (questionId) {
    const { allCachedQuestionsDict } = this.getState();
    // console.log('QuestionnaireStore getQuestionById:', questionId, ', allCachedQuestionsDict:', allCachedQuestionsDict);
    return allCachedQuestionsDict[questionId] || {};
  }

  getQuestionnaireById (questionnaireId) {
    const { allCachedQuestionnairesDict } = this.getState();
    // console.log('QuestionnaireStore getQuestionnaireById:', questionnaireId, ', allCachedQuestionnairesDict:', allCachedQuestionnairesDict);
    return allCachedQuestionnairesDict[questionnaireId] || {};
  }

  getSearchResults () {
    // console.log('QuestionnaireStore getSearchResults:', this.getState().searchResults);
    return this.getState().searchResults || [];
  }

  reduce (state, action) {
    const { allCachedQuestionsDict, allCachedQuestionnairesDict } = state;
    // let questionnaireTemp = {};
    let questionId = -1;
    let questionnaireId = -1;
    let revisedState = state;
    let searchResults = [];

    switch (action.type) {
      case 'question-list-retrieve':
        if (!action.res.success) {
          console.log('QuestionnaireStore ', action.type, ' FAILED action.res:', action.res);
          return state;
        }
        revisedState = state;
        // console.log('QuestionnaireStore question-list-retrieve questionList:', action.res.questionList);
        if (action.res.isSearching && action.res.isSearching === true) {
          // console.log('QuestionnaireStore isSearching:', action.res.isSearching);
          searchResults = action.res.questionList;
          // console.log('QuestionnaireStore searchResults:', searchResults);
          revisedState = {
            ...revisedState,
            searchResults,
          };
        }
        if (action.res.questionList) {
          action.res.questionList.forEach((question) => {
            // console.log('QuestionnaireStore team-retrieve adding question:', question);
            if (question && (question.id >= 0)) {
              allCachedQuestionsDict[question.id] = question;
            }
          });
          // console.log('allCachedQuestionsDict:', allCachedQuestionsDict);
          revisedState = {
            ...revisedState,
            allCachedQuestionsDict,
          };
        }
        // console.log('QuestionnaireStore revisedState:', revisedState);
        return revisedState;

      case 'question-save':
        if (!action.res.success) {
          console.log('QuestionnaireStore ', action.type, ' FAILED action.res:', action.res);
          return state;
        }
        revisedState = state;
        if (action.res.questionId >= 0) {
          questionId = action.res.questionId;
        } else {
          questionId = -1;
        }

        if (questionId >= 0) {
          if (action.res.questionCreated || action.res.questionUpdated) {
            // console.log('QuestionnaireStore question-save questionId:', questionId);
            allCachedQuestionsDict[questionId] = action.res;
            revisedState = {
              ...revisedState,
              allCachedQuestionsDict,
              mostRecentQuestionIdSaved: questionId,
            };
          } else {
            console.log('QuestionnaireStore question-save NOT updated or saved.');
          }
        } else {
          console.log('QuestionnaireStore question-save MISSING questionId:', questionId);
        }
        return revisedState;

      case 'questionnaire-list-retrieve':
        if (!action.res.success) {
          console.log('QuestionnaireStore ', action.type, ' FAILED action.res:', action.res);
          return state;
        }
        revisedState = state;
        // console.log('QuestionnaireStore questionnaire-list-retrieve questionnaireList:', action.res.questionnaireList);
        if (action.res.isSearching && action.res.isSearching === true) {
          // console.log('QuestionnaireStore isSearching:', action.res.isSearching);
          searchResults = action.res.questionnaireList;
          // console.log('QuestionnaireStore searchResults:', searchResults);
          revisedState = {
            ...revisedState,
            searchResults,
          };
        }
        if (action.res.questionnaireList) {
          action.res.questionnaireList.forEach((questionnaire) => {
            // console.log('QuestionnaireStore team-retrieve adding questionnaire:', questionnaire);
            if (questionnaire && (questionnaire.id >= 0)) {
              allCachedQuestionnairesDict[questionnaire.id] = questionnaire;
            }
          });
          // console.log('allCachedQuestionnairesDict:', allCachedQuestionnairesDict);
          revisedState = {
            ...revisedState,
            allCachedQuestionnairesDict,
          };
        }
        // console.log('QuestionnaireStore revisedState:', revisedState);
        return revisedState;

      case 'questionnaire-save':
        if (!action.res.success) {
          console.log('QuestionnaireStore ', action.type, ' FAILED action.res:', action.res);
          return state;
        }
        revisedState = state;
        if (action.res.questionnaireId >= 0) {
          questionnaireId = action.res.questionnaireId;
        } else {
          questionnaireId = -1;
        }

        if (questionnaireId >= 0) {
          // console.log('QuestionnaireStore questionnaire-save questionnaireId:', questionnaireId);
          allCachedQuestionnairesDict[questionnaireId] = action.res;
          revisedState = {
            ...revisedState,
            allCachedQuestionnairesDict,
            mostRecentQuestionnaireIdSaved: questionnaireId,
          };
        } else {
          console.log('QuestionnaireStore questionnaire-save MISSING questionnaireId:', questionnaireId);
        }
        return revisedState;

      default:
        return state;
    }
  }
}

export default new QuestionnaireStore(Dispatcher);
