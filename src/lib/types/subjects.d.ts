declare type exams = {
  _id: string;
  title: string;
  duration: number;
  subject: string;
  numberOfQuestions: number;
  active: true;
  createdAt: string;
};

declare type subjects = [
  {
    _id: string;
    name: string;
    icon: string;
    createdAt: string;
  }
]
