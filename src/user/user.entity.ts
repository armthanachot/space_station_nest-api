import { Entity, Column, PrimaryGeneratedColumn,CreateDateColumn,UpdateDateColumn } from 'typeorm';

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    email:string

    @Column()
    password:string

    @Column()
    fname:string

    @Column()
    lname:string

    @Column()
    address:string

    @Column()
    img:string

    @CreateDateColumn()
    created_at:Date

    @UpdateDateColumn()
    updated_at:Date
}