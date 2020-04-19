import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('appoitntments')
class Appointment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    provider: string;

    @Column('timestamp with time zone')
    date: Date;
}

export default Appointment;
