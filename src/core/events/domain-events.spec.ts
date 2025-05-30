import { AggregateRoot } from "../entities/aggregate-root";
import { UniqueEntityID } from "../entities/unique-entity-id";
import { DomainEvent } from "./domain-event";
import { DomainEvents } from "./domain-events";

class CustomAggregateCreated implements DomainEvent{
    public ocurredAt: Date;
    private aggragate: CustomAggregate

    constructor(aggregate: CustomAggregate){
        this.ocurredAt = new Date()
        this.aggragate = aggregate
    }

    public getAggregateId(): UniqueEntityID{
        return this.aggragate.id
    }
}

class CustomAggregate extends AggregateRoot<null>{
    static create(){
        const aggregate = new CustomAggregate(null)

        aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))

        return aggregate
    }
}

describe('domain events', () => {
    it('should be able to dispatch and listen events', () => {
        const callbackSpy = vi.fn()
        // Subscriber cadastrado (ouvindo o evendo de "resposta criada")
        DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

        // Estou criando uma resposta porém SEM salvar no banco
        const aggregate = CustomAggregate.create()

        // Estou assegurando que o evento foi criado porém NÃO foi disparado
        expect(aggregate.domainEvents).toHaveLength(1)

        // Estou salvando a resposta no banco de dados e assim disparando o evento
        DomainEvents.dispatchEventsForAggregate(aggregate.id)

        // O subscriber ouve o evento e faz o que precisa ser feiro com o dado
        expect(callbackSpy).toHaveBeenCalled()
        expect(aggregate.domainEvents).toHaveLength(0)
    })
})