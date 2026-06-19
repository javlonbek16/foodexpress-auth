import { AbstractEntity } from "database/abstract.entity";
import { Column, Entity, Index, } from "typeorm";

@Entity({ name: "otp" })
@Index(["email", "code"])
@Index(["email"])
export class OtpEntity extends AbstractEntity {

    @Column({ type: "varchar" })
    email: string

    @Column({ type: "varchar" })
    code: string;

    @Column({ type: "int", default: 0 })
    attempts: number;

    @Column({ type: "timestamp" })
    expires_at: Date;
}
