export interface User{
  name:string;
}


export interface Message{
  id?:number;
  from:string;
  to?:string;
  content:string;
  idCorso?:number;
}

export interface Chats{
 
  from:string;
  messages:Message[];
}


export class MessaggioModel{
  constructor(data?: MessaggioModel) {
    if (data) {
      Object.assign(this, data);
    }
  }

  id: number = 0;
  from!:string;
  idCorso!:number;
  content!:string;
 
}

export class CorsiModel {
  constructor(data?: CorsiModel) {
    if (data) {
      Object.assign(this, data);
    }
  }

  id: number = 0;
  idUtente !: number
  idMateria !: number;

  utente?: UtenteModel;
  materia?: MateriaModel;

}


export class CategorieModel {
  constructor(data?: CategorieModel) {
    if (data) {
      Object.assign(this, data);
    }
  }

  id: number = 0;
  nome !: string
  numeroCorsi !: number;


}

export class SyllabusModel {
  constructor(data?: SyllabusModel) {
    if (data) {
      Object.assign(this, data);
    }
  }

  id: number = 0;
  idCorso!: number
  numLezione !: number;

  argomentoLezione?: string;
  corso?: CorsiModel;

}

export class CorsiDiStudioModel {
  constructor(data?: CorsiDiStudioModel) {
    if (data) {
      Object.assign(this, data);
    }
  }
  id: number = 0;
  nomeCorso!: string;

}

export class MateriaModel {
  constructor(data?: MateriaModel) {
    if (data) {
      Object.assign(this, data);
    }
  }
  id: number = 0;
  nome!: string;
  idCorsoDiStudi!: number;

}

export class MateriaDTOModel {
  constructor(data?: MateriaDTOModel) {
    if (data) {
      Object.assign(this, data);
    }
  }
  id: number = 0;
  nome!: string;
  numeroTutor!: number;

}

export class CorsoDTOModel {
  constructor(data?: CorsoDTOModel) {
    if (data) {
      Object.assign(this, data);
    }
  }
  id: number = 0;
  nome!: string;
  universita!: string;
  voto!:number;

}

export class AteneoModel {
  constructor(data?: AteneoModel) {
    if (data) {
      Object.assign(this, data);
    }
  }
  id: number = 0;
  nomeAteneo!: string;

}

export class UtenteModel {
  constructor(data?: UtenteModel) {
    if (data) {
      Object.assign(this, data);
    }
  }
  id!: number;
  nome!: string;
  cognome!: string;
  dataDiNascita!: Date;
  annoImmatricolazione!: number;
  email!: string;
  passwordHash !: string;
  idAteneo!: number;
  ateneo!:AteneoModel;
  idCorsoDiStudi!: number;
  corsoDiStudi!: CorsiDiStudioModel;

}

export interface UserClaims {
  id: string;

  nome: string;
  cognome: string;

}
